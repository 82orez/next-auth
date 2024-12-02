"use client";
import Link from "next/link";
import SignOut from "@/components/sign-out";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status, data } = useSession();
  console.log("status: ", status);
  console.log("data: ", data);

  return (
    <div className={"flex flex-col gap-5"}>
      <div>Homes</div>
      {status === "authenticated" ? (
        <>
          <div>{data?.user.email}</div>
          <img src={data?.user.image} width={50} height={50} alt={data?.user.name} />
          <div>{data?.expires}</div>
          <SignOut />
        </>
      ) : (
        <Link href={"/users/sign-in"}>Move to Sign In Page</Link>
      )}
    </div>
  );
}
