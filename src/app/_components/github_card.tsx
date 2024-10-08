'use client';

import { Card } from './card';
import { useState } from 'react';
import type { FC } from 'react';

type Activity = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

const getContributions = (
  contributions: Activity[],
  offset = 0
): Activity[] => {
  const today = new Date();

  // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const weeksToGoBack = 26;
  const currentWeekDay = today.getDay();

  // Calculate the end of the last week (Saturday)
  const endOfLastWeek = new Date(
    today.getTime() - (currentWeekDay + 1) * 24 * 60 * 60 * 1000
  );

  // Calculate the start of the 26-weeks-ago week (Sunday), considering the offset
  const startOf26WeeksAgo = new Date(
    endOfLastWeek.getTime() - (weeksToGoBack + offset) * oneWeekInMilliseconds
  );

  // Calculate the end of the 26-weeks-ago week (Saturday), considering the offset
  const endOf26WeeksAgo = new Date(
    endOfLastWeek.getTime() - offset * oneWeekInMilliseconds
  );

  return contributions.filter((activity) => {
    const activityDate = new Date(activity.date);

    return activityDate <= endOf26WeeksAgo && activityDate >= startOf26WeeksAgo;
  });
};

const GitHubCard: FC = () => {
  const [total, setTotal] = useState(0);

  return (
    <Card title="GitHub Activity" className="p-4">
      <div className="flex flex-col gap-4">
        <p className="text-neutral-500 text-sm dark:text-neutral-400">
          {total} contributions in the last year
        </p>
        <div className="flex flex-col gap-[3px]">
        ... 
        </div>
      </div>
    </Card>
  );
};

export default GitHubCard;
