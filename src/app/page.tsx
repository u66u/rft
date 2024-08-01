import "~/styles/globals.css"
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import GitHubCard from "~/app/_components/github_card";
import PageLayout from "./pageLayout";
import SyllogismGame from "./_components/syl";

export default async function Home() {
  const session = await getServerAuthSession();
  const hello = await api.post.hello({ text: "user" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <PageLayout>
        <h1 className="text-3xl leading-tight tracking-tight sm:text-4xl">
          Hello, I’m Hayden Bleasel. I’m an Australian Design Engineer currently
          based in
        </h1>
        <SyllogismGame />
        <div className="prose-img:m-0 prose-p:m-0 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <GitHubCard />
          </div>
          <GitHubCard />
          <GitHubCard />
          <div className="md:col-span-2">
            <GitHubCard />
          </div>
        </div></PageLayout>
    </HydrateClient >
  );
}