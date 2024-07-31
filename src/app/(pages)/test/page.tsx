import type { Metadata } from 'next';
import Image from 'next/image';
import type { ReactElement } from 'react';
import GitHubCard from '~/app/_components/github_card';
export const generateMetadata = async (): Promise<Metadata> => {

  return {
    title: 'Hayden Bleasel | Design Engineer',
    description: `I’m currently the Chief Product Officer at Corellium and the founder of Eververse. Currently based in `,
  };
};

const Test = async (): Promise<ReactElement> => {

  return (
    <>
      <h1 className="text-3xl leading-tight tracking-tight sm:text-4xl">
        Hello, I’m Hayden Bleasel. I’m an Australian Design Engineer currently
        based in 
      </h1>
      <div className="prose-img:m-0 prose-p:m-0 grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <GitHubCard />
        </div>
          <GitHubCard />
        <div className="md:col-span-2">
          <GitHubCard />
        </div>
      </div>
    </>
  );
};

export default Test;
