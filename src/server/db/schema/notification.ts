import { relations, sql } from 'drizzle-orm'
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'

import { competition } from './competition'
import { user } from './user'

export const createTable = sqliteTableCreator((name) => `good-lyft_${name}`)

export const notification = createTable(
  'notification',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    competitionId: int('competition_id', { mode: 'number' }).references(
      () => competition.id,
      {
        onDelete: 'cascade',
      },
    ),
    userId: text('user_id').references(() => user.id, {
      onDelete: 'cascade',
    }),
    title: text('title'),
    description: text('description'),
    isRead: int('is_read', { mode: 'boolean' }),
    isViewed: int('is_viewed', { mode: 'boolean' }),
    isDeleted: int('is_deleted', { mode: 'boolean' }),
    notes: text('notes'),
  },
  (e) => {
    return {
      competitionidIdx: index('notification_competitionid_idx').on(
        e.competitionId,
      ),
      userIdIndex: index('notification_user_id_idx').on(e.userId),
    }
  },
)

export const notificationRelations = relations(
  notification,
  ({ one, many }) => ({
    competition: one(competition, {
      fields: [notification.competitionId],
      references: [competition.id],
    }),
    user: one(user, {
      fields: [notification.userId],
      references: [user.id],
    }),
  }),
)
