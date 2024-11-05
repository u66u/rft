type AnswerKey = Map<number, number[]>;

const JCTIvalidAnswers: AnswerKey = new Map(
    [[6],[3],[2],[4],[1],[1],[1,5],[2],[5],[3],[3,4],[6],[5],[6],[2,5],[3],[5],[4],[5],[4],[5],[6],[2,4],[1,4],[4],[5],[5,6],[1],[1],[1],[4],[3],[3],[1],[6],[6],[3],[5],[6],[3],[2],[6],[5],[3],[5],[1],[2],[5],[6],[3],[1],[2]]
        .map((answers, index) => [index + 1, answers])
);

/**
 * Checks if a given answer is correct for a specific question
 * @param questionNumber - The question number (1-52)
 * @param answer - The answer to check (1-6)
 * @returns boolean indicating if the answer is correct
 */
export function checkJCTIAnswer(questionNumber: number, answer: number): boolean {
    const correctAnswers = JCTIvalidAnswers.get(questionNumber);
    if (!correctAnswers) {
        throw new Error(`Invalid question number: ${questionNumber}`);
    }
    return correctAnswers.includes(answer);
}
