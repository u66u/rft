import React from 'react';
import PageLayout from '~/app/pageLayout';

interface StageCompleteProps {
    correctAnswers: number;
    totalQuestions: number;
    onNextStage: () => void;
    onRetry: () => void;
}

export const StageComplete: React.FC<StageCompleteProps> = ({
    correctAnswers,
    totalQuestions,
    onNextStage,
    onRetry,
}) => (
    <PageLayout>
        <div>
            <h2>Stage Complete</h2>
            <p>You got {correctAnswers} out of {totalQuestions} correct.</p>
            {correctAnswers === totalQuestions ? (
                <button onClick={onNextStage}>Next Stage</button>
            ) : (
                <button onClick={onRetry}>Retry Stage</button>
            )}
        </div>
    </PageLayout>
);