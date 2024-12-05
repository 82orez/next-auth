"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  // * 클라이언트 컴포넌트에서 로그인 session 정보 가져오기 : useSession()
  const { status, data } = useSession();
  console.log("status: ", status);
  console.log("data: ", data);
  const router = useRouter();

  // 로그인이 되어 있을 때 이 페이지로 접근하면 루트 페이지 '/'로 되돌림.
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // * 중복된 email 로 다른 소셜 로그인 인증을 시도했을 때 signIn 콜백 함수에서 반환한 에러 관련 메서지를 받아서 UI 기반 오류 메세지 출력.
  // 콜백 함수에서 반환한 에러 관련 메서지를 처리하기 위한 상태 설정.
  const [error, setError] = useState<null | string>(null);
  const [provider, setProvider] = useState<null | string>(null);

  useEffect(() => {
    // ? 오류 방지를 위해 아래 코드를 클라이언트 환경에서만 실행할 수 있도록 설정.
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setError(params.get("error"));
      setProvider(params.get("provider"));
    }
  }, []);

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
      {/*UI 기반 오류 메세지 부분*/}
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
