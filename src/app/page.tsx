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

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <PageLayout>
        <h1 className="text-3xl leading-tight tracking-tight sm:text-4xl">
          Hello, I’m Hayden Bleasel. I’m an Australian Design Engineer currently
          based in
        </h1>
        <div className="prose-img:m-0 prose-p:m-0 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <GitHubCard />
          </div>
          <GitHubCard />
          <GitHubCard />
          <div className="md:col-span-2">
            <GitHubCard />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
      </PageLayout>
    </HydrateClient >
  );
}