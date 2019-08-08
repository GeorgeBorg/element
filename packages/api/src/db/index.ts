import { getConnectionOptions } from "typeorm"
import { NODE_ENV } from "../lib/config"

export const createDbConnection = async () => {
  // Create DB connection
  await getConnectionOptions(NODE_ENV)

  // const connection = await createConnection({
  //   ...options,
  //   name: "default",
  //   // @ts-ignore
  //   url: DATABASE_URL,
  // })

  // Run migrations in production
  // if (isProduction) await connection.runMigrations()
}
