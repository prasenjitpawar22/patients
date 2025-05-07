import { TPatient } from "@/lib/types";
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button";
import { usePGlite } from "@electric-sql/pglite-react";
import { useState } from "react";

export function SqlQueryBox({ setPatients }: { setPatients: React.Dispatch<React.SetStateAction<TPatient[] | undefined>> }) {
    const db = usePGlite()
    const [query, setQuery] = useState('')
    const [error, setError] = useState('')

    const handleQuery = async() => {
        try {
            const res = await db.query<TPatient>(query)
            setPatients(res.rows)
        }
        catch (e) {
            setError('Invalid query!')
        }
    }

    return <div className="grid border-t grid-cols-3 grow items-end gap-4">
        <div className="col-span-2">
            {error &&  <p className="text-xs mb-2 md:text-sm text-destructive"> {error} </p> }
            <Textarea onChange={(e) => {
                setQuery(e.target.value)
                setError('')
            }} className="h-24" placeholder="SELECT * FROM Patients WHERE firstName LIKE '%sam%'" />
        </div>
        <Button onClick={handleQuery} variant={'outline'} className="cursor-pointer max-w-1/3">Query</Button>
    </div>
}