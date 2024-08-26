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
    } = useStage(stageNumber, config);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (syllogisms.length > 0) {
            setIsLoading(false);
        }
    }, [syllogisms]);

    const handleNextStage = () => {
        const nextStage = parseInt(stageNumber) + 1;
        router.push(`/stage/${nextStage}`);
    };

    if (isLoading) {
        return <div>Loading stage...</div>;
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
                    onStart={startStage}
                />
            )}
            {currentAttempt && currentSyllogism && (
                <>
                    <progress value={currentSyllogismIndex + 1} max={16} />
                    <p>Question {currentSyllogismIndex + 1} of 16</p>
                    <SyllogismDisplay
                        syllogism={currentSyllogism}
                        onAnswer={handleAnswer}
                    />
                </>
            )}
            {isComplete && (
                <StageComplete
                    correctAnswers={correctAnswers}
                    totalQuestions={16}
                    onNextStage={handleNextStage}
                    onRetry={startStage}
                />
            )}
        </div>
    );
};

export default StageClient