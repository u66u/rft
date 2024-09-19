import { signOut } from "next-auth/react";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const UpdateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const userRouter = createTRPCRouter({
  greet: protectedProcedure.query(async ({ ctx }) => {
    const { name } = ctx.session.user;
    return `Hello, ${name}`;
  }),

  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const result = await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          ...input,
        },
      });

      // Revalidate paths if necessary
      // revalidatePath("/");
      // revalidatePath("/dashboard/settings");

      return result;
    }),

  deleteProfile: protectedProcedure.mutation(async ({ ctx }) => {
    const { db, session } = ctx;

    await db.user.delete({
      where: {
        id: session.user.id,
      },
    });

    return true;
  }),
});
