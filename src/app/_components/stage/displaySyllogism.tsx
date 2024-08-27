import React from 'react';
import { Syllogism } from '~/lib/types/syllogism_types';
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Clock } from 'lucide-react';
import { Card } from '../card';

interface SyllogismDisplayProps {
    syllogism: Syllogism;
    onAnswer: (answer: boolean) => void;
    buttonsDisabled: boolean;
    timeLeft: number;
    questionNumber: number;
    totalQuestions: number;
}

export const SyllogismDisplay: React.FC<SyllogismDisplayProps> = ({
    syllogism,
    onAnswer,
    buttonsDisabled,
    timeLeft,
    questionNumber,
    totalQuestions
}) => {
    const overallProgressPercentage = ((questionNumber - 1) / totalQuestions) * 100;

    return (
        <div className="space-y-6 w-full max-w-2xl mx-auto">
            <div className="space-y-2">
                <Progress value={overallProgressPercentage} className="w-full bg-orange-700" />
                <div className="flex justify-between text-md">
                    <span>Question {questionNumber} of {totalQuestions}</span>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{timeLeft}s</span>
                    </div>
                </div>
            </div>

            <Card className="space-y-4 border-2 border-neutral-800 p-6 rounded-lg" title={''}>
                <div className="">
                    {syllogism.premises.map((premise, index) => (
                        <p key={index} className="text-md text-gray-200">{premise.left} is {premise.relation} {premise.right}</p>
                    ))}
                </div>

                <p className="text-xl font-bold text-orange-500">Is {syllogism.question.left} {syllogism.question.type} {syllogism.question.right}?</p>

                <div className="flex space-x-4">
                    <Button
                        disabled={buttonsDisabled}
                        onClick={() => onAnswer(true)}
                        variant="outline"
                        className="flex-1 bg-gray-700 text-white hover:bg-gray-600"
                    >
                        Yes
                    </Button>
                    <Button
                        disabled={buttonsDisabled}
                        onClick={() => onAnswer(false)}
                        variant="outline"
                        className="flex-1 bg-gray-700 text-white hover:bg-gray-600"
                    >
                        No
                    </Button>
                </div>
            </Card >
        </div>
    );
};