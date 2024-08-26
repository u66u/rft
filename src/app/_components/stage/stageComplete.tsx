import React from 'react';
import PageLayout from '~/app/pageLayout';

interface StageCompleteProps {
    correctAnswers: number;
    totalQuestions: number;
    onNextStage: () => void;
    onRetry: () => void;
    retryDisabled: boolean;
    onRetryAsTest: () => void;
    testModeCompleted: boolean;
}

export const StageComplete: React.FC<StageCompleteProps> = ({
    correctAnswers,
    totalQuestions,
    onNextStage,
    onRetry,
    retryDisabled,
    onRetryAsTest,
    testModeCompleted,
}) => (
    <PageLayout>
        <div>
            <h2>Stage Complete</h2>
            <p>You got {correctAnswers} out of {totalQuestions} correct.</p>
            {correctAnswers === totalQuestions ? (
                <>
                    <button onClick={onNextStage}>Next Stage</button>
                    {!testModeCompleted && <button onClick={onRetryAsTest}>Retry in Test Mode</button>}
                </>
            ) : (
                <button disabled={retryDisabled} onClick={onRetry}>Retry Stage</button>
            )}
        </div>
    </PageLayout>
);
