import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  greet: protectedProcedure.query(async ({ ctx }) => {
    const { name } = ctx.session.user;
    return `Hello, ${name}`;
  }),
});
