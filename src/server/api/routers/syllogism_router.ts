import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AttemptType } from "@prisma/client";

export const syllogismRouter = createTRPCRouter({
  startAttempt: protectedProcedure
    .input(
      z.object({
        stageNumber: z.number(),
        timeConstraintSecs: z.number(),
        attemptType: z.nativeEnum(AttemptType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { stageNumber, timeConstraintSecs, attemptType } = input;

      return db.syllogismAttempt.create({
        data: {
          user_id: session.user.id,
          attempt_type: attemptType,
          stage_number: stageNumber,
          time_constraint_secs: timeConstraintSecs,
          correct_answers: 0,
          completed_successfully: false,
        },
      });
    }),

  updateAttempt: protectedProcedure
    .input(
      z.object({
        attemptId: z.string(),
        correctAnswers: z.number(),
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { attemptId, correctAnswers, completed } = input;

      return db.syllogismAttempt.update({
        where: { id: attemptId },
        data: {
          correct_answers: correctAnswers,
          completed_successfully: completed,
          finishedAt: new Date(),
        },
      });
    }),

  completeStage: protectedProcedure
    .input(
      z.object({
        stageNumber: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { stageNumber } = input;

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { completed_stages: true },
      });

      if (!user?.completed_stages.includes(stageNumber)) {
        return db.user.update({
          where: { id: session.user.id },
          data: {
            completed_stages: {
              push: stageNumber,
            },
          },
        });
      }

      return { message: "Stage already completed" };
    }),

  getUserProgress: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { completed_stages: true },
    });

    return user?.completed_stages ?? [];
  }),
});
