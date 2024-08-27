// In StageClient.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useStage } from '~/lib/hooks/useStage';
import { StageSetup } from './stageSetup';
import { SyllogismDisplay } from './displaySyllogism';
import { StageComplete } from './stageComplete';
import { SyllogismConfig } from '~/lib/types/syllogism_types';
import { AttemptType } from '@prisma/client';
import { Progress } from "~/components/ui/progress";
import PageLayout from '~/app/pageLayout';

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
        isLoadingFinal,
        timeLeft,
        timerActive,
    } = useStage(stageNumber, config);

    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [retryDisabled, setRetryDisabled] = useState(false);

    const handleNextStage = () => {
        const nextStage = parseInt(stageNumber) + 1;
        router.push(`/stage/${nextStage}`);
    };

    const handleRetry = async (retryMode: AttemptType) => {
        setRetryDisabled(true);
        setButtonsDisabled(false);
        setMode(retryMode);
        await startStage(retryMode);
        setRetryDisabled(false);
    };

    const handleRetryAsTest = () => {
        handleRetry(AttemptType.Test);
    };

    const handleAnswerClick = async (answer: boolean) => {
        if (!buttonsDisabled) {
            setButtonsDisabled(true);
            await handleAnswer(answer);
            setButtonsDisabled(false);
        }
    };

    if (isLoadingFinal) {
        return <div>Loading...</div>;
    }

    const currentSyllogism = syllogisms[currentSyllogismIndex];

    return (
        <PageLayout>
            <div className="mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Stage {stageNumber}</h1>
                {!currentAttempt && !isComplete && (
                    <StageSetup
                        mode={mode}
                        setMode={setMode}
                        timeConstraint={timeConstraint}
                        setTimeConstraint={setTimeConstraint}
                        onStart={() => {
                            setButtonsDisabled(false);
                            startStage(mode);
                        }}
                    />
                )}
                {currentAttempt && currentSyllogism && (
                    <>
                        <SyllogismDisplay
                            syllogism={currentSyllogism}
                            onAnswer={handleAnswerClick}
                            buttonsDisabled={buttonsDisabled}
                            timeLeft={timeLeft}
                            questionNumber={currentSyllogismIndex + 1}
                            totalQuestions={16}
                        />
                    </>
                )}
                {isComplete && (
                    <StageComplete
                        correctAnswers={correctAnswers}
                        totalQuestions={16}
                        onNextStage={handleNextStage}
                        onRetry={handleRetry}
                        retryDisabled={retryDisabled}
                        onRetryAsTest={handleRetryAsTest}
                        testModeCompleted={testModeCompleted}
                        currentMode={mode}
                    />
                )}
            </div>
        </PageLayout>
    );
};

export default StageClient;