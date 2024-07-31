"use client";


import { api } from "~/trpc/react";

const GreetingComponent: React.FC = () => {
  const { data: greeting, error } = api.user.greet.useQuery();

  if (error) return <div>Error: {error.message}</div>;

  return <div>{greeting}</div>;
};

export default GreetingComponent;