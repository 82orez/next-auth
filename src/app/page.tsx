"use client";
import Link from "next/link";
import SignOut from "@/components/sign-out";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();
  console.log(status);

  return (
    <div className={"flex flex-col gap-5"}>
      <div>Homes</div>
      {status === "authenticated" ? <SignOut /> : <Link href={"/users/sign-in"}>Move to Sign In Page</Link>}
    </div>
  );
}
