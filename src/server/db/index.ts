import { createClient, type Client } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import { env } from '@/env'
import * as user from './schema/user'
import * as competition from './schema/competition'
import * as entry from './schema/entry'
import * as division from './schema/division'
import * as event from './schema/event'
import * as lift from './schema/lift'

const schema = {
  ...user,
  ...competition,
  ...entry,
  ...division,
  ...event,
  ...lift,
}

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */

const globalForDb = globalThis as unknown as {
  client: Client | undefined
}

export const client =
  globalForDb.client ??
  createClient({
    url: env.DATABASE_URL,
    syncUrl: env.DATABASE_SYNC_URL,
    // url: env.DATABASE_SYNC_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  })
if (env.NODE_ENV !== 'production') globalForDb.client = client

export const db = drizzle(client, { schema })
