"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ClientSidePage() {
  const { status, data } = useSession();
  console.log("status: ", status);
  console.log("data: ", data);

  return (
    <div className={"flex flex-col gap-5"}>
      <div>ClientSidePage</div>
      <div>Hello~ {data?.user.name}</div>
      <img src={data?.user?.image || ""} width={50} height={50} alt={data?.user?.name || ""} className={"rounded-full"} />
      <Link href={"/"}>To the Home</Link>
    </div>
  );
}
