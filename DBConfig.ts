import { Pool } from "pg";

const itemsPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

export default itemsPool;