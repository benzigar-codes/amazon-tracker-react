import useUser from "@/utils/useUser";
import useUtils from "@/utils/useUtils";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import { HiSparkles } from "react-icons/hi";

export default function Login() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { executeFunction } = useUtils();
  const [loading, setLoading] = React.useState(false);

  const [input, setInput] = React.useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (loading) return;
    if (!input.email || !input.password) return;
    setLoading(true);
    try {
      const data = await executeFunction({
        action: "login",
        email: input.email,
        password: input.password,
      });
      if (data?.user?.email) {
        setUser(data?.user);
      } else {
        alert("Wrong Password! :(");
      }
    } catch (er) {}
    setLoading(false);
  };

  React.useEffect(() => {
    if (user) router.push("/home");
  }, [user]);

  return (
    <div className="container flex justify-center items-center mx-auto">
      <Head>
        <title>Login</title>
      </Head>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="lg:min-w-[470px] mt-10 flex flex-col justify-center items-center"
      >
        <HiSparkles className="text-4xl" />
        <h1 className="mt-5 font-bold text-2xl">Welcome Back</h1>
        <p className="text-xs opacity-50">Good to see you back</p>
        <input
          autoFocus
          onChange={(e) => {
            setInput({
              ...input,
              email: e.target.value,
            });
          }}
          placeholder="Email"
          className="rounded-md dark:bg-zinc-800 w-full mt-10 px-5 py-4 focus:outline-none w-full bg-zinc-100 border-b-2 border-zinc-500"
          type="email"
          name=""
          id=""
          value={input.email}
        />
        <input
          onChange={(e) => {
            setInput({
              ...input,
              password: e.target.value,
            });
          }}
          placeholder="Password"
          className="rounded-md dark:bg-zinc-800 w-full mt-5 px-5 py-4 focus:outline-none w-full bg-zinc-100 border-b-2 border-zinc-500"
          type="password"
          name=""
          id=""
          value={input.password}
        />
        <p className="w-full text-xs opacity-50 mt-5">
          Only Approved Users can sign in, so no account creation
        </p>
        <button className="dark:bg-white dark:text-black bg-black text-white px-3 py-3 w-full mt-10 rounded-md hover:bg-zinc-600">
          {loading ? "Loading" : "Continue"}
        </button>
      </form>
    </div>
  );
}
