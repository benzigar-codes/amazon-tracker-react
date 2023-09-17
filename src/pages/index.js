import useUser from "@/utils/useUser";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Home() {
  const { user, setUser } = useUser();
  return (
    <div className="flex flex-col bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <Head>
        <title>Amazon Tracker</title>
      </Head>

      <div className="container mx-auto justify-center items-center flex-1 flex flex-col">
        <h1 className="leading-normal font-bold text-2xl lg:text-5xl max-w-[90vw] lg:max-w-[800px] text-center">
          Track the Amazon Products in Easy and Smart Way
        </h1>
        <p className="text-sm text-center max-w-[80vw] lg:max-w-[700px] mt-5">
          Pin your favorite Amazon product and see the pricing details and
          everything in one area.
        </p>
        {user ? (
          <Link
            href={"/home"}
            className="dark:bg-white dark:text-black mt-10 font-bold bg-black text-white text-sm py-3 px-5 rounded-full"
          >
            Go to Console
          </Link>
        ) : (
          <Link
            href={"/login"}
            className="dark:bg-white dark:text-black mt-10 font-bold bg-black text-white text-sm py-3 px-5 rounded-full"
          >
            Let's Login
          </Link>
        )}
      </div>
    </div>
  );
}
