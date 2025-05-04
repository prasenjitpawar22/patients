// my-pglite-worker.js
import { PGlite } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'
import { worker } from '@electric-sql/pglite/worker'

worker({
  async init(options) {
    // const meta = options.meta
    // Do something with additional metadata.
    // or even run your own code in the leader along side the PGlite
    return new PGlite({
      dataDir: options.dataDir,
      extensions: {live}
    })
  },
})