"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { status, data } = useSession();
  console.log("status: ", status);
  console.log("data: ", data);
  const router = useRouter();

  // 에러 및 provider 상태 관리
  const [error, setError] = useState<null | string>(null);
  const [provider, setProvider] = useState<null | string>(null);

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setError(params.get("error"));
      setProvider(params.get("provider"));
    }
  }, []);

  // 반드시 필요한 코드인지는 의문스러움.
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleClickGoogle = async () => {
    await signIn("google", { callbackUrl: "/" });
  };
  const handleClickNaver = async () => {
    await signIn("naver", { callbackUrl: "/" });
  };
  const handleClickKakao = async () => {
    await signIn("kakao", { callbackUrl: "/" });
  };

  return (
    <div>
      {error === "alreadyLinked" && provider && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md">이미 {provider} 로그인으로 가입하셨습니다. 해당 계정으로 로그인해주세요.</div>
      )}
      <div className="flex flex-col gap-6">
        <Link href={"/"}>Move to Home</Link>
        <h1 className="text-lg font-semibold text-center">로그인 또는 회원가입</h1>
        <hr className="border-b-gray-300" />
        <div className="text-xl md:text-2xl font-semibold">Fastcampus Nextbnb 에 오신 것을 환영합니다.</div>
      </div>
      <div className="flex flex-col gap-5 mt-16">
        <button
          type="button"
          onClick={handleClickGoogle}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold">
          {/*<FcGoogle className="absolute left-5 text-xl my-auto inset-y-0" />*/}
          구글 로그인하기
        </button>
        <button
          type="button"
          onClick={handleClickNaver}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold bg-green-400">
          {/*<FcGoogle className="absolute left-5 text-xl my-auto inset-y-0" />*/}
          Naver 로그인하기
        </button>
        <button
          type="button"
          onClick={handleClickKakao}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold bg-yellow-300">
          {/*<FcGoogle className="absolute left-5 text-xl my-auto inset-y-0" />*/}
          Kakao 로그인하기
        </button>
      </div>
    </div>
  );
}
