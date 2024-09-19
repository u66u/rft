import type { Metadata } from "next";

import { getServerAuthSession } from "~/server/auth";
import DeleteAccount from "~/app/_components/profile/delete_account";
import UpdateNameAvatar from "~/app/_components/profile/update_name_avatar";
import { Button } from "~/components/ui/button";
import SettingsCard from "~/app/_components/profile/settings_card";
import { HeartCrackIcon } from "lucide-react";
import PageLayout from "~/app/pageLayout";

export const metadata: Metadata = {
  title: "Settings - Dashboard",
};


const SettingsPage = async () => {
  const session = await getServerAuthSession();

  if (!session) return null;

  return (
    <PageLayout>
    <main className="flex w-full flex-col space-y-4 duration-500 animate-in fade-in-5 slide-in-from-bottom-2">
      <UpdateNameAvatar
        name={session.user.name!}
        email={session.user.email!}
        avatar={session.user.image!}
      />
      <SettingsCard title="Account" description={""} children={undefined}>
        <div className="flex w-52 flex-col space-y-2">
          <p>Delete account:</p>
          <DeleteAccount
            email={session.user.email!}
            trigger={
              <Button variant="destructive" size="sm">
                <HeartCrackIcon size={14} />
                <span>Delete Account</span>
              </Button>
            }
          />
        </div>
      </SettingsCard>
    </main>
</PageLayout>
  );
};

export default SettingsPage;
