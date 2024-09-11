import * as user from './schema/user'
import * as competition from './schema/competition'
import * as entry from './schema/entry'
import * as division from './schema/division'
import * as event from './schema/event'

export const schema = {
  ...user,
  ...competition,
  ...entry,
  ...division,
  ...event,
}
