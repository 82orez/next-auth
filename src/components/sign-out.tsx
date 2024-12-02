"use client";

import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <button
      className={"bg-red-300 border-2 rounded-xl max-w-[120px] p-2"}
      onClick={() => {
        signOut();
      }}>
      SignOut
    </button>
  );
}
