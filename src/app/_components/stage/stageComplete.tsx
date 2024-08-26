// In StageComplete.tsx
import React from 'react';
import PageLayout from '~/app/pageLayout';
import { AttemptType } from '@prisma/client';

interface StageCompleteProps {
    correctAnswers: number;
    totalQuestions: number;
    onNextStage: () => void;
    onRetry: (mode: AttemptType) => void;
    retryDisabled: boolean;
    onRetryAsTest: () => void;
    testModeCompleted: boolean;
    currentMode: AttemptType;
}

export const StageComplete: React.FC<StageCompleteProps> = ({
    correctAnswers,
    totalQuestions,
    onNextStage,
    onRetry,
    retryDisabled,
    onRetryAsTest,
    testModeCompleted,
    currentMode,
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
                <button disabled={retryDisabled} onClick={() => onRetry(currentMode)}>
                    Retry Stage ({currentMode === AttemptType.Normal ? 'Normal' : 'Test'} Mode)
                </button>
            )}
        </div>
    </PageLayout>
);