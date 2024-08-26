import React from 'react';
import { AttemptType } from '@prisma/client';
import PageLayout from '~/app/pageLayout';

interface StageSetupProps {
    mode: AttemptType;
    setMode: (mode: AttemptType) => void;
    timeConstraint: number;
    setTimeConstraint: (time: number) => void;
    onStart: () => void;
}

export const StageSetup: React.FC<StageSetupProps> = ({
    mode,
    setMode,
    timeConstraint,
    setTimeConstraint,
    onStart,
}) => (
    <PageLayout>
        <div>
            <select value={mode} onChange={(e) => setMode(e.target.value as AttemptType)}>
                <option value={AttemptType.Normal}>Normal</option>
                <option value={AttemptType.Test}>Test</option>
            </select>
            <input
                type="number"
                value={timeConstraint}
                onChange={(e) => setTimeConstraint(parseInt(e.target.value))}
            />
            <button onClick={onStart}>Start</button>
        </div>
    </PageLayout>
);
