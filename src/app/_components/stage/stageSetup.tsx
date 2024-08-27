// In StageSetup.tsx
import React, { useState } from 'react';
import { AttemptType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
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
}) => {
    const [error, setError] = useState<string | null>(null);

    const handleTimeConstraintChange = (value: string) => {
        const time = parseInt(value);
        if (time >= 2 && time <= 30) {
            setTimeConstraint(time);
            setError(null);
        } else {
            setError("Time constraint must be between 2 and 30 seconds.");
        }
    };

    return (
        <div className="space-y-4 py-4 rounded-lg shadow">
            <Select value={mode} onValueChange={(value) => setMode(value as AttemptType)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={AttemptType.Normal}>Normal</SelectItem>
                    <SelectItem value={AttemptType.Test}>Test</SelectItem>
                </SelectContent>
            </Select>
            <Input
                type="number"
                value={timeConstraint}
                onChange={(e) => handleTimeConstraintChange(e.target.value)}
                min={2}
                max={30}
                placeholder="Time constraint (2-30 seconds)"
            />
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button onClick={onStart} disabled={!!error}>Start</Button>
        </div>
    );
};