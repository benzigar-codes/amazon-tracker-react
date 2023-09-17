import "@fontsource-variable/inter";
import "@/styles/globals.css";
import NextNProgress from "nextjs-progressbar";

import React from "react";

import { SiGoogleanalytics } from "react-icons/si";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import Link from "next/link";
import useUser from "@/utils/useUser";
import useStorage from "@/utils/useStorage";

export default function App({ Component, pageProps }) {
  const { user, setUser } = useUser();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [loadingFromLocal, setLoadingFromLocal] = React.useState(true);

  // Apply dark mode class to the HTML element when isDarkMode changes
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const load = async () => {
    const ifData = await localStorage.getItem("user");
    if (ifData) setUser(JSON.parse(ifData));
    const ifTheme = await localStorage.getItem("theme");
    if (ifTheme) setIsDarkMode(JSON.parse(ifTheme));
    setLoadingFromLocal(false);
  };

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    if (loadingFromLocal === false)
      localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  React.useEffect(() => {
    if (loadingFromLocal === false)
      localStorage.setItem("theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  if (loadingFromLocal) return;
  return (
    <div
      className={`min-h-screen dark:bg-black bg-white text-black dark:text-white flex flex-col ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <NextNProgress height={5} color={isDarkMode ? "white" : "black"} />
      <div className="sticky top-0 z-10 bg-white text-black dark:bg-black dark:text-white">
        <div className="px-4 lg:px-0 bg-white dark:bg-black pt-5 container border-b-2 pb-5 dark:border-zinc-700 flex justify-between items-center mx-auto">
          <Link href={"/"} className="font-bold flex items-center">
            <SiGoogleanalytics className="text-2xl" />
            <h1 className="ml-2 text-xl">Amazon Tracker</h1>
          </Link>
          {/* <Link
            target="_blank"
            href={"https://www.benzigar.in/"}
            className="text-xs bg-black dark:bg-white dark:text-black text-white px-2 py-1 rounded-full"
          >
            Made by Benzigar
          </Link> */}
          <div className="text-2xl cursor-pointer flex items-center">
            <p
              onClick={() => {
                setIsDarkMode(!isDarkMode);
              }}
            >
              {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
            </p>
            {user ? (
              <div className="flex items-center">
                <div className="hidden ml-4 border-l-2 pl-4 text-sm font-bold lg:flex items-center">
                  <button>{user.email}</button>
                </div>
                <div
                  onClick={() => {
                    setUser(null);
                  }}
                  className="ml-4 border-l-2 pl-4 text-sm font-bold flex items-center"
                >
                  <button>Logout</button>
                </div>
              </div>
            ) : (
              <Link
                href={"/login"}
                className="ml-4 border-l-2 pl-4 text-sm font-bold flex items-center"
              >
                <button>Login</button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
