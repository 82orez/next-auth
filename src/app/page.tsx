import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>Homes</div>
      <Link href={"/users/sign-in"}>Move to Sign In Page</Link>
    </div>
  );
}
