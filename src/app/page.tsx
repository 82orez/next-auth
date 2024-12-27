"use server";

import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  // const { status, data } = useSession();
  // console.log("status: ", status);
  // console.log("data: ", data);
  const session = await getServerSession(authOptions);
  console.log("session: ", session);

  return (
    <div className={"flex flex-col gap-5"}>
      <div>Homes</div>
      {session ? (
        <>
          <div>{session?.user?.email}</div>
          <img src={session?.user?.image || ""} width={50} height={50} alt={session?.user?.name || ""} />
          <div>{session?.expires}</div>
          <SignOutButton />
        </>
      ) : (
        <Link href={"/users/sign-in"}>Move to Sign In Page</Link>
      )}
      <Link href={"/server-side-page"}>Move to Server Side Page</Link>
      <Link href={"/client-side-page"}>Move to Client Side Page</Link>
    </div>
  );
}
