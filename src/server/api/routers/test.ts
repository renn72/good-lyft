import { z } from "zod";
import { client } from "@/server/db";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const testRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    await client.sync();
    const res = await ctx.db.query.user.findMany();

    return res
  }),

});
