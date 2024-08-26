"use client";

import { syllogismStages } from '~/logic/constants';
import StageClient from '~/app/_components/stage/stageClient';


import { SyllogismConfig } from '~/lib/types/syllogism_types';

interface StagePageProps {
    params: { stageNumber: string }
}

const StagePage = ({ params }: StagePageProps) => {
    const { stageNumber } = params;

    const config = syllogismStages[`stage${stageNumber}`];

    if (!stageNumber || !config) {
        return <div>Invalid stage</div>;
    }

    return <StageClient stageNumber={stageNumber} config={config as SyllogismConfig} />;
};

export default StagePage;