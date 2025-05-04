import { PGliteWorker } from '@electric-sql/pglite/worker'
import { live } from "@electric-sql/pglite/live"
import { PGliteProvider, } from "@electric-sql/pglite-react"
import { ThemeProvider } from "./components/theme-provider"
import { Page } from "./pages/patients"
import PGWorker from './../public/worker.js?worker'
import { Toaster } from './components/ui/sonner'

// const db = await PGlite.create({
//   extensions: { live },
//   dataDir: 'idb://my-pgdata'
// })

const db = await PGliteWorker.create(
  new PGWorker({name:'pglite-worker'}),
  {
    dataDir: 'idb://my-db',
    meta: {
      // additional metadata passed to `init`
    },
    extensions:{live,}
  },
)

await db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  dateOfBirth TEXT NOT NULL, -- Stored as ISO string (e.g. 1990-01-01)
  gender TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipCode TEXT NOT NULL,
  insuranceProvider TEXT NOT NULL,
  insuranceNumber TEXT NOT NULL,
  emergencyContactName TEXT NOT NULL,
  emergencyContactPhone TEXT NOT NULL,
  medicalHistory TEXT -- optional
);`)

function App() {
  return (
    <PGliteProvider db={db}>
      <ThemeProvider defaultTheme="dark" storageKey="patient-ui-theme">
        <Page/>
        <Toaster />
      </ThemeProvider>
    </PGliteProvider>

  )
}

export default App
