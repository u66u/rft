'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useStage } from '~/lib/hooks/syllogism';
import { StageSetup } from './stageSetup';
import { SyllogismDisplay } from './displaySyllogism';
import { StageComplete } from './stageComplete';
import { SyllogismConfig } from '~/lib/types/syllogism_types';
import { AttemptType } from '@prisma/client';

interface StageClientProps {
    stageNumber: string;
    config: SyllogismConfig;
}

const StageClient: React.FC<StageClientProps> = ({ stageNumber, config }) => {
    const router = useRouter();
    const {
        mode,
        setMode,
        timeConstraint,
        setTimeConstraint,
        currentAttempt,
        syllogisms,
        currentSyllogismIndex,
        correctAnswers,
        isComplete,
        startStage,
        handleAnswer,
        testModeCompleted,
        isLoadingFinal, // Get loading state
    } = useStage(stageNumber, config);

    const [isLoading, setIsLoading] = useState(true);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [retryDisabled, setRetryDisabled] = useState(false);

    useEffect(() => {
        if (syllogisms.length > 0) {
            setIsLoading(false);
        }
    }, [syllogisms]);

    useEffect(() => {
        // Disable buttons when stage is complete
        if (isComplete) {
            setButtonsDisabled(true);
        } else {
            setButtonsDisabled(false);
        }
    }, [isComplete]);

    const handleNextStage = () => {
        const nextStage = parseInt(stageNumber) + 1;
        router.push(`/stage/${nextStage}`);
    };

    const handleRetry = async (testMode: boolean = false) => {
        setRetryDisabled(true);
        setButtonsDisabled(false);

        if (testMode) {
            setMode(AttemptType.Test);
        } else {
            setMode(AttemptType.Normal);
        }

        await startStage();
        setRetryDisabled(false);
    };

    const handleAnswerClick = async (answer: boolean) => {
        if (!buttonsDisabled) {
            setButtonsDisabled(true);
            await handleAnswer(answer); // Final state update handled inside useStage
            setButtonsDisabled(false);
        }
    };

    if (isLoading || isLoadingFinal) { // Show loader for either initial or final loading
        return <div>Loading...</div>;
    }

    const currentSyllogism = syllogisms[currentSyllogismIndex];

    return (
        <div>
            <h1>Stage {stageNumber}</h1>
            {!currentAttempt && !isComplete && (
                <StageSetup
                    mode={mode}
                    setMode={setMode}
                    timeConstraint={timeConstraint}
                    setTimeConstraint={setTimeConstraint}
                    onStart={() => {
                        setButtonsDisabled(false);
                        startStage();
                    }}
                />
            )}
            {currentAttempt && currentSyllogism && (
                <>
                    <progress value={currentSyllogismIndex + 1} max={16} />
                    <p>Question {currentSyllogismIndex + 1} of 16</p>
                    <SyllogismDisplay
                        syllogism={currentSyllogism}
                        onAnswer={handleAnswerClick}
                        buttonsDisabled={buttonsDisabled}
                    />
                </>
            )}
            {isComplete && (
                <StageComplete
                    correctAnswers={correctAnswers}
                    totalQuestions={16}
                    onNextStage={handleNextStage}
                    onRetry={() => handleRetry(false)}
                    retryDisabled={retryDisabled}
                    onRetryAsTest={() => handleRetry(true)}
                    testModeCompleted={testModeCompleted}
                />
            )}
        </div>
    );
};

export default StageClient;
