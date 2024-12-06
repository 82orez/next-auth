"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ClientSidePage() {
  const { status, data } = useSession();
  console.log("status: ", status);
  console.log("data: ", data);

  return (
    <div>
      <div>ClientSidePage</div>
      <Link href={"/"}>To the Home</Link>
    </div>
  );
}
