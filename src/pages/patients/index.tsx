import { AddPatientForm } from "@/components/patients-form";
import { columns } from "@/components/patients/columns";
import { PatientsDataTable } from "@/components/patients/data-table";
import { DataTableSkeleton } from "@/components/patients/data-table-skeleton";
import { SqlQueryBox } from "@/components/sql-query-box";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { TPatient } from "@/lib/types";
import { useLiveQuery } from "@electric-sql/pglite-react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function Page() {
    const patientsQuery = useLiveQuery<TPatient>(`select * from patients`)
    const data = patientsQuery?.rows;
    const [patients, setPatients] = useState<TPatient[] | undefined>()

    useEffect(() => {
        setPatients(data)
    }, [data])


    return <div className="flex h-screen flex-col p-4 gap-4 mx-auto py-10">
        <div className="flex justify-end items-center gap-4">
            <AddPatientForm />
            <ThemeMode />
        </div>
        <div className="max-h-96 overflow-scroll">
            {!patients ? <DataTableSkeleton /> :
                <PatientsDataTable columns={columns} data={patients} />}
        </div>
        <SqlQueryBox setPatients={setPatients} />
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