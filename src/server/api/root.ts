import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import { competitionRouter } from "@/server/api/routers/competition";
import { userRouter } from "@/server/api/routers/user";
import { entryRouter } from "@/server/api/routers/entry";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  competition: competitionRouter,
  user: userRouter,
  entry: entryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
