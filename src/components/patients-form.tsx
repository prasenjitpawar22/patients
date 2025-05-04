"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePGlite } from "@electric-sql/pglite-react"
import { toast } from "sonner"

// Define the validation schema using Zod
export const patientFormSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    dateOfBirth: z.date({ required_error: "Date of birth is required" }),
    gender: z.string({ required_error: "Please select a gender" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    address: z.string().min(5, { message: "Address must be at least 5 characters" }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    state: z.string().min(2, { message: "State must be at least 2 characters" }),
    zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters" }),
    insuranceProvider: z.string().min(2, { message: "Insurance provider must be at least 2 characters" }),
    insuranceNumber: z.string().min(5, { message: "Insurance number must be at least 5 characters" }),
    emergencyContactName: z.string().min(2, { message: "Emergency contact name must be at least 2 characters" }),
    emergencyContactPhone: z.string().min(10, { message: "Emergency contact phone must be at least 10 digits" }),
    medicalHistory: z.string().optional(),
})

// Infer the type from the schema
type PatientFormValues = z.infer<typeof patientFormSchema>

// Default values for the form
const defaultValues: Partial<PatientFormValues> = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    insuranceProvider: "",
    insuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalHistory: "",
}

export function AddPatientForm() {
    const db = usePGlite()
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")

    // Initialize the form with React Hook Form and Zod resolver
    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues,
    })

    // Handle form submission
    async function onSubmit(data: PatientFormValues) {
        const { firstName, lastName, address, city, dateOfBirth, email,
            emergencyContactName, emergencyContactPhone, gender, insuranceNumber, insuranceProvider
            , phone, state, zipCode,
            medicalHistory
        } = data;

        try {
            const query = `INSERT INTO patients 
            (firstName, lastName, dateOfBirth, gender, email, phone, address, city, state, zipCode,
            insuranceProvider, insuranceNumber, emergencyContactName, emergencyContactPhone, 
            medicalHistory) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`;

            const values = [
                firstName,
                lastName,
                dateOfBirth.toDateString(), // should be a string like "YYYY-MM-DD"
                gender,
                email,
                phone,
                address,
                city,
                state,
                zipCode,
                insuranceProvider,
                insuranceNumber,
                emergencyContactName,
                emergencyContactPhone,
                medicalHistory ?? '1'
            ];
            await db.query(query, values);
            // form.reset() // TODO: Undo this comment 
            setOpen(false)
        } catch (error) {
            toast(`${error}`)
            console.log(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant={'outline'} > <Plus className="h-4 w-4" /> Register New Patient</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] flex flex-col h-[80vh]">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex ">
                        <DialogTitle>Patient Registration Form</DialogTitle>
                    </div>
                    <DialogDescription>Please fill out all required information to register as a new patient.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        const firstErrorField = Object.keys(errors)[0];
                        if (firstErrorField) {
                  
                          // Set the correct tab
                          if (["insuranceProvider", "insuranceNumber"].includes(firstErrorField)) {
                            setActiveTab("insurance");
                          } else if (["email", "phone", "address", "city", "state", "zipCode"].includes(firstErrorField)) {
                            setActiveTab("contact");
                          } else if (["emergencyContactName", "emergencyContactPhone", "medicalHistory"].includes(firstErrorField)) {
                            setActiveTab("medical");
                          } else {
                            setActiveTab("personal");
                          }
                        }
                      
                    })}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="px-6">
                                <TabsList className="grid grid-cols-4 w-full">
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="contact">Contact</TabsTrigger>
                                    <TabsTrigger value="insurance">Insurance</TabsTrigger>
                                    <TabsTrigger value="medical">Medical</TabsTrigger>
                                </TabsList>
                            </div>

                            <ScrollArea className="pt-2 md:h-96 rounded-md border p-4">
                                <TabsContent value="personal" className="mt-2 space-y-4 px-3">
                                    <h3 className="text-lg font-medium">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dateOfBirth"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Date of Birth</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                                                >
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gender</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button type="button" variant="outline" onClick={async () => {
                                            const isValid = await form.trigger(['firstName', 'lastName', 'dateOfBirth', 'gender'], { shouldFocus: true })
                                            console.log(isValid);

                                            if (isValid) setActiveTab("contact")
                                        }}>
                                            Next
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="contact" className="mt-2 space-y-4 px-3">
                                    <h3 className="text-lg font-medium">Contact Information</h3>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(123) 456-7890" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Main St" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="New York" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="NY" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="zipCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zip Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="10001" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-between space-x-2 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                                            Previous
                                        </Button>
                                        <Button type="button" variant="outline" onClick={async () => {
                                            const isValid = await form.trigger(['email', 'phone', 'address', 'city', 'state', 'zipCode'], { shouldFocus: true })
                                            if (isValid) setActiveTab("insurance")
                                        }}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="insurance" className="mt-2 space-y-4 px-3">
                                    <h3 className="text-lg font-medium">Insurance Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                                        <FormField
                                            control={form.control}
                                            name="insuranceProvider"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Insurance Provider</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Blue Cross Blue Shield" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="insuranceNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Insurance ID Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="XYZ123456789" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <h3 className="text-lg font-medium pt-4">Emergency Contact</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="emergencyContactName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Emergency Contact Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Jane Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="emergencyContactPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Emergency Contact Phone</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="(123) 456-7890" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-between space-x-2 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab("contact")}>
                                            Previous
                                        </Button>
                                        <Button type="button" variant="outline" onClick={async () => {
                                            const isValid = await form.trigger(['insuranceProvider', 'insuranceNumber', 'emergencyContactName', 'emergencyContactPhone',], { shouldFocus: true })
                                            if (isValid) setActiveTab("medical")
                                        }}>
                                            Next
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="medical" className="mt-2 space-y-4 px-3">
                                    <h3 className="text-lg font-medium">Medical History</h3>

                                    <FormField
                                        control={form.control}
                                        name="medicalHistory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Relevant Medical History (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Please list any relevant medical conditions, allergies, or medications..."
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    This information will be kept confidential and only used for medical purposes.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-between space-x-2 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab("insurance")}>
                                            Previous
                                        </Button>
                                        <Button type="submit">Submit Registration</Button>
                                    </div>
                                </TabsContent>
                            </ScrollArea>
                        </Tabs>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
