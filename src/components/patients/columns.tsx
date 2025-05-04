import { TPatient } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<TPatient>[] = [
    {
        accessorKey: 'firstname',
        header: "First Name"
    },
    {
        accessorKey: 'lastname',
        header: "Last Name"
    }, {
        accessorKey: 'email',
        header: "Email"
    }, {
        accessorKey: 'gender',
        header: "Gender"
    }, {
        accessorKey: 'phone',
        header: "Phone"
    }, {
        accessorKey: 'state',
        header: "State"
    }, {
        accessorKey: 'zipcode',
        header: "Zip Code"
    }, {
        accessorKey: 'dateofbirth',
        header: "Date Of Birth"
    },
]