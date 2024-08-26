"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { AttemptType } from "@prisma/client";
import { SyllogismConfig, Syllogism } from "~/lib/types/syllogism_types";
import { generateSyllogism } from "~/logic/syllogism";

export const useStage = (stageNumber: string, config: SyllogismConfig) => {
  const [mode, setMode] = useState<AttemptType>(AttemptType.Normal);
  const [timeConstraint, setTimeConstraint] = useState(60);
  const [currentAttempt, setCurrentAttempt] = useState<string | null>(null);
  const [syllogisms, setSyllogisms] = useState<Syllogism[]>([]);
  const [currentSyllogismIndex, setCurrentSyllogismIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [testModeCompleted, setTestModeCompleted] = useState<boolean>(false);
  const [isLoadingFinal, setIsLoadingFinal] = useState(false);

  const startAttemptMutation = api.syllogism.startAttempt.useMutation();
  const updateAttemptMutation = api.syllogism.updateAttempt.useMutation();
  const completeStagesMutation = api.syllogism.completeStage.useMutation();

  useEffect(() => {
    const generatedSyllogisms = Array(16)
      .fill(null)
      .map(() => generateSyllogism(config));
    setSyllogisms(generatedSyllogisms);
  }, [config]);

  const startStage = async (currentMode: AttemptType) => {
    const attempt = await startAttemptMutation.mutateAsync({
      stageNumber: parseInt(stageNumber),
      timeConstraintSecs: timeConstraint,
      attemptType: currentMode,
    });
    setCurrentAttempt(attempt.id);
    setCurrentSyllogismIndex(0);
    setCorrectAnswers(0);
    setIsComplete(false);
    setIsLoadingFinal(false);
  };

  const handleAnswer = async (answer: boolean) => {
    if (!currentAttempt || currentSyllogismIndex >= syllogisms.length) return;

    const currentSyllogism = syllogisms[currentSyllogismIndex];
    if (!currentSyllogism) return;

    const isCorrect = answer === currentSyllogism.answer;
    if (isCorrect) setCorrectAnswers((prev) => (prev < 16 ? prev + 1 : prev));

    const nextIndex = currentSyllogismIndex + 1;

    if (nextIndex >= 16 || (mode === AttemptType.Normal && !isCorrect)) {
      setIsLoadingFinal(true); // Set loading state for final attempt
      await finishAttempt(correctAnswers + (isCorrect ? 1 : 0)); // Pass the correct answer count after the last question
    } else {
      setCurrentSyllogismIndex(nextIndex);
    }
  };

  const finishAttempt = async (finalCorrectAnswers: number) => {
    if (!currentAttempt) return;

    const completed = finalCorrectAnswers >= 16;
    await updateAttemptMutation.mutateAsync({
      attemptId: currentAttempt,
      correctAnswers: finalCorrectAnswers, // Log actual correct answers count
      completed,
    });

    if (completed && mode === AttemptType.Test) {
      setTestModeCompleted(true);
    }

    if (completed) {
      await completeStagesMutation.mutateAsync({
        stageNumber: parseInt(stageNumber),
      });
    }

    setIsComplete(true);
    setCurrentAttempt(null);
    setIsLoadingFinal(false); // Reset loading state
  };

  return {
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
  };
};
