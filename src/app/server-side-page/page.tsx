"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function ServerSidePage() {
  const session = await getServerSession(authOptions);
  console.log("session: ", session);

  return (
    <div className={"flex flex-col gap-5"}>
      <div>ServerSidePage</div>
      {session && <div className={"text-amber-500 text-xl font-bold"}>Logged IN</div>}
      <Link href={"/"}>To the Home</Link>
    </div>
  );
}
