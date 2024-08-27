"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import { Card, CardContent } from "~/components/ui/card";
import { Check } from 'lucide-react';
import PageLayout from '~/app/pageLayout';

const StagesPage = () => {
    const router = useRouter();
    const { data: completedStages, isLoading } = api.syllogism.getUserProgress.useQuery();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const totalStages = 70;

    return (
        <PageLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-orange-500 mb-6">Syllogism Stages</h1>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {Array.from({ length: totalStages }, (_, i) => i + 1).map((stage) => (
                        <Card
                            key={stage}
                            onClick={() => router.push(`/stage/${stage}`)}
                            className={`cursor-pointer ${completedStages?.includes(stage)
                                ? "completed-stage transition-all duration-300 ease-in-out"
                                : "uncompleted-stage hover:shadow-lg hover:bg-gray-200 transition-all duration-300 ease-in-out"
                                }`}
                        >
                            <CardContent className="p-4 flex items-center justify-center h-24 relative">
                                <span className="text-2xl font-bold">{stage}</span>
                                {completedStages?.includes(stage) && (
                                    <Check className="absolute top-2 right-2 w-5 h-5" />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};

export default StagesPage;
