'use client';

import { useParams } from 'next/navigation';
import { Stage } from '~/app/_components/stage';
import PageLayout from '~/app/pageLayout';
import { syllogismStages } from '~/logic/constants';
export default function StagePage() {
    const params = useParams();
    const stageNumber = params.stageNumber as string;

    if (!stageNumber) return <div>Invalid stage</div>;

    const stageConfig = syllogismStages[`stage${stageNumber}`];

    if (!stageConfig) return <div>Stage not found</div>;

    return (
        <PageLayout>
            <Stage stageNumber={parseInt(stageNumber, 10)} config={stageConfig} />
        </PageLayout>
    );
}