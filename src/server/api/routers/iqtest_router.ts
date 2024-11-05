import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { IqTestType, IqTestVerification } from "@prisma/client";

const BATCH_SIZE = 5; // Update responses after every 5 answers

export const iqTestRouter = createTRPCRouter({
  startTest: protectedProcedure
    .input(
      z.object({
        testType: z.nativeEnum(IqTestType),
        timed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { testType, timed } = input;

      return db.iqTest.create({
        data: {
          user_id: session.user.id,
          test_type: testType,
          num_of_correct_answers: 0,
          responses: [],
          timed,
          verification: IqTestVerification.TakenOnWebsite,
        },
      });
    }),

  updateResponse: protectedProcedure
    .input(
      z.object({
        testId: z.string(),
        questionIndex: z.number(),
        response: z.number(),
        isCorrect: z.boolean(),
        batchNumber: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { testId, questionIndex, response, isCorrect, batchNumber } = input;

      // Only update responses in database every BATCH_SIZE answers
      // or if it's the last question (batchNumber === -1)
      if (batchNumber % BATCH_SIZE === 0 || batchNumber === -1) {
        return db.iqTest.update({
          where: { id: testId },
          data: {
            responses: {
              push: response,
            },
            num_of_correct_answers: {
              increment: isCorrect ? 1 : 0,
            },
          },
        });
      }

      // If not updating database, just return the current test
      return db.iqTest.findUnique({
        where: { id: testId },
      });
    }),

  finishTest: protectedProcedure
    .input(
      z.object({
        testId: z.string(),
        score: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { testId, score } = input;

      return db.iqTest.update({
        where: { id: testId },
        data: {
          score,
          finishedAt: new Date(),
        },
      });
    }),

  getUserTests: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    return db.iqTest.findMany({
      where: { user_id: session.user.id },
      orderBy: { startedAt: "desc" },
    });
  }),
});
