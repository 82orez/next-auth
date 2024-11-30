"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const { status } = useSession();
  console.log("status: ", status);

  return (
    <div>
      <Link href={"/"}>Move to Home</Link>
      <div>SignInPage</div>
    </div>
  );
}
