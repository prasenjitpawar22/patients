import { AddPatientForm } from "@/components/patients-form";
import { columns } from "@/components/patients/columns";
import { PatientsDataTable } from "@/components/patients/data-table";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { TPatient } from "@/lib/types";
import { useLiveQuery } from "@electric-sql/pglite-react";
import { MoonIcon, SunIcon } from "lucide-react";

export function Page() {
    const patientsQuery = useLiveQuery<TPatient>(`select * from patients`)

    const data = patientsQuery?.rows;
    console.log(data);

    if (!data) return <> loading </>

    return <div className="flex flex-col p-4 gap-4 mx-auto py-10">
        <div className="flex justify-end items-center gap-4">
            <AddPatientForm />
            <ThemeMode />
        </div>
        <PatientsDataTable columns={columns} data={data} />
    </div>
}

function ThemeMode() {
    const { setTheme, theme } = useTheme()

    function handleClick() {
        if (theme === 'light')
            setTheme('dark')
        else setTheme('light')
    }

    return <Button className="cursor-pointer" variant={'ghost'} onClick={() => handleClick()}>{theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}</Button>

}