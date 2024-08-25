'use client';
import { useState, useEffect } from 'react';
import { api } from "~/trpc/react";
import { AttemptType } from '@prisma/client';
import { SyllogismConfig, Syllogism } from '~/lib/types/syllogism_types';
import { generateSyllogism } from '~/logic/syllogism';
import { useRouter } from 'next/navigation'

interface StageProps {
    stageNumber: number;
    config: SyllogismConfig;
}

export const Stage: React.FC<StageProps> = ({ stageNumber, config }) => {
    const router = useRouter();
    const [currentSyllogism, setCurrentSyllogism] = useState<Syllogism | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [attemptType, setAttemptType] = useState<AttemptType>(AttemptType.Normal);
    const [timeConstraintSecs, setTimeConstraintSecs] = useState(30);
    const [isStageStarted, setIsStageStarted] = useState(false);
    const [isStageCompleted, setIsStageCompleted] = useState(false);
    const [completed, setCompleted] = useState(0);

    const utils = api.useUtils();

    const startAttempt = api.syllogism.startAttempt.useMutation({
        onSuccess: (data) => {
            setAttemptId(data.id);
            generateNewSyllogism();
        },
    });

    const updateAttempt = api.syllogism.updateAttempt.useMutation();
    const completeStage = api.syllogism.completeStage.useMutation();

    const generateNewSyllogism = () => {
        const newSyllogism = generateSyllogism(config);
        setCurrentSyllogism(newSyllogism);
    };

    const handleStartStage = () => {
        setIsStageStarted(true);
        startAttempt.mutate({
            stageNumber,
            timeConstraintSecs,
            attemptType,
        });
    };

    const handleAnswer = async (userAnswer: boolean) => {
        const isCorrect = currentSyllogism?.answer === userAnswer;

        if (isCorrect) {
            setCorrectAnswers((prev) => prev + 1);
        }

        setCompleted((prev) => prev + 1);

        if (completed + 1 >= 16) {
            await finishAttempt(true);
        } else if (attemptType === AttemptType.Normal && !isCorrect) {
            await finishAttempt(false);
        } else {
            generateNewSyllogism();
        }
    };

    const finishAttempt = async (successful: boolean) => {
        if (attemptId) {
            await updateAttempt.mutateAsync({
                attemptId,
                correctAnswers: correctAnswers + (successful ? 1 : 0),
                completed: successful,
            });

            if (successful) {
                await completeStage.mutateAsync({ stageNumber });
                setIsStageCompleted(true);
            } else if (attemptType === AttemptType.Normal) {
                setIsStageStarted(false);
            }

            await utils.syllogism.invalidate();
        }
    };

    const handleRestart = () => {
        setCorrectAnswers(0);
        setCompleted(0);
        setIsStageStarted(false);
        setIsStageCompleted(false);
        setAttemptId(null);
    };

    const handleNextStage = () => {
        router.push(`/stage/${stageNumber + 1}`);
    };

    if (!isStageStarted) {
        return (
            <div>
                <h2>Stage {stageNumber}</h2>
                <select value={attemptType} onChange={(e) => setAttemptType(e.target.value as AttemptType)}>
                    <option value={AttemptType.Normal}>Normal Mode</option>
                    <option value={AttemptType.Test}>Test Mode</option>
                </select>
                <input
                    type="number"
                    value={timeConstraintSecs}
                    onChange={(e) => setTimeConstraintSecs(Number(e.target.value))}
                    min="2"
                    max="30"
                />
                <button onClick={handleStartStage}>Start Stage</button>
            </div>
        );
    }

    if (isStageCompleted) {
        return (
            <div>
                <h2>Stage {stageNumber} completed successfully!</h2>
                {attemptType === AttemptType.Normal && (
                    <button onClick={() => setAttemptType(AttemptType.Test)}>Take Test for this Stage</button>
                )}
                <button onClick={handleNextStage}>Go to Next Stage</button>
            </div>
        );
    }

    if (!currentSyllogism) return <div>Loading...</div>;

    return (
        <div>
            <h2>Stage {stageNumber}</h2>
            <div>Mode: {attemptType === AttemptType.Normal ? 'Normal' : 'Test'}</div>
            <div>Progress: {completed}/16</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(completed / 16) * 100}%` }}></div>
            </div>
            {currentSyllogism.premises.map((premise, index) => (
                <div key={index}>
                    {premise.left} is {premise.relation} than {premise.right}
                </div>
            ))}
            <div>
                Is {currentSyllogism.question.left} {currentSyllogism.question.type} than {currentSyllogism.question.right}?
            </div>
            <button onClick={() => handleAnswer(true)}>Yes</button>
            <button onClick={() => handleAnswer(false)}>No</button>
            {attemptType === AttemptType.Normal && !isStageStarted && (
                <button onClick={handleRestart}>Restart Stage</button>
            )}
        </div>
    );
};