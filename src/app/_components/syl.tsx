"use client"

import React, { useState, useEffect } from 'react';
import { validateConfigAndGenerateSyllogism, SyllogismConfig, SyllogismType, EqualityType, SequenceType, Syllogism } from '~/logic/syllogism';


const SyllogismGame: React.FC = () => {
    const [syllogism, setSyllogism] = useState<Syllogism | null>(null);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');

    const syllogismConfig: { [key: string]: SyllogismConfig } = {
        stage3: {
            syllogismType: SyllogismType.Equality,
            relationshipTypes: [EqualityType.Opposite, EqualityType.Same],
            questionTypes: [EqualityType.Same],
            sequenceType: SequenceType.NonSequential,
            nonSequentialIndex: 1,
            questionIndexes: [[0, 4]],
            structure: "SOSO",
            premiseCount: 4,
        },
    };

    useEffect(() => {
        generateNewSyllogism();
    }, []);

    const generateNewSyllogism = () => {
        const config = syllogismConfig.stage3;
        if (!config) {
            console.error("Syllogism configuration for stage3 is missing");
            return;
        }
        const newSyllogism = validateConfigAndGenerateSyllogism(config);
        if (newSyllogism === null) {
            console.error("Failed to generate a valid syllogism");
            return;
        }
        setSyllogism(newSyllogism);
        setMessage('');
    };

    const handleAnswer = (userAnswer: boolean) => {
        if (!syllogism) return;

        if (userAnswer === syllogism.answer) {
            setScore(score + 1);
            setMessage('Correct! +1 point');
        } else {
            setMessage('Incorrect. Try again!');
        }

        setTimeout(generateNewSyllogism, 1500);
    };

    if (!syllogism) return <div>Loading...</div>;

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Syllogism Game</h1>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Premises:</h2>
                {syllogism.premises.map((premise, index) => (
                    <p key={index}>
                        {premise.left} is {premise.relation} to {premise.right}
                    </p>
                ))}
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Question:</h2>
                <p>
                    Is {syllogism.question.left} {syllogism.question.type} to{' '}
                    {syllogism.question.right}?
                </p>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleAnswer(true)}
                >
                    Yes
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleAnswer(false)}
                >
                    No
                </button>
            </div>
            <div className="text-center">
                <p className="font-bold">Score: {score}</p>
                {message && <p className="mt-2 text-lg">{message}</p>}
            </div>
        </div>
    );
};

export default SyllogismGame;