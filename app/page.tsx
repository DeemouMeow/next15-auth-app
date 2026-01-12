"use server";

import { LoginButton } from "@/components/common/buttons/login-button";

export default async function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-sky-500">
      <div className="flex flex-col space-y-8 items-center justify-center">
        <h1 className="text-white text-5xl font-semibold drop-shadow-md">Authorization Home Page</h1>
        <LoginButton/>
      </div>
    </div>
  );
}
