import React from 'react';
import PageLayout from '~/app/pageLayout';
import { AttemptType } from '@prisma/client';
import { Button } from '~/components/ui/button';

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
    <div>
        <h2>Stage Complete</h2>
        <p>You got {correctAnswers} out of {totalQuestions} correct.</p>

        <div className="flex space-x-4">
            {correctAnswers === totalQuestions ? (
                <>
                    <Button
                        onClick={onNextStage}
                        variant="outline"
                        className="flex-1 bg-gray-700 text-white hover:bg-gray-600"
                    >
                        Next Stage
                    </Button>
                    {!testModeCompleted && (
                        <Button
                            onClick={onRetryAsTest}
                            variant="outline"
                            className="flex-1 bg-gray-700 text-white hover:bg-gray-600"
                        >
                            Retry in Test Mode
                        </Button>
                    )}
                </>
            ) : (
                <Button
                    disabled={retryDisabled}
                    onClick={() => onRetry(currentMode)}
                    variant="outline"
                    className="flex-1 bg-gray-700 text-white hover:bg-gray-600"
                >
                    Retry Stage ({currentMode === AttemptType.Normal ? 'Normal' : 'Test'} Mode)
                </Button>
            )}
        </div>
    </div>
);
