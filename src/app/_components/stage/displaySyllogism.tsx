'use client';

import React from 'react';
import { Syllogism } from '~/lib/types/syllogism_types';
import PageLayout from '~/app/pageLayout';

interface SyllogismDisplayProps {
    syllogism: Syllogism;
    onAnswer: (answer: boolean) => void;
}

export const SyllogismDisplay: React.FC<SyllogismDisplayProps> = ({ syllogism, onAnswer }) => {
    return (
        <PageLayout>
            <div>
                {syllogism.premises.map((premise, index) => (
                    <p key={index}>{premise.left} is {premise.relation} {premise.right}</p>
                ))}
                <p>Is {syllogism.question.left} {syllogism.question.type} {syllogism.question.right}?</p>
                <button onClick={() => onAnswer(true)}>Yes</button>
                <button onClick={() => onAnswer(false)}>No</button>
            </div></PageLayout>
    );
};