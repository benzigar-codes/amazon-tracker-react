import Head from "next/head";
import React from "react";

import { AiOutlineEnter, AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  BsCheck,
  BsFillPinAngleFill,
  BsFillPinFill,
  BsPin,
  BsSearch,
} from "react-icons/bs";
import { PiButterflyDuotone } from "react-icons/pi";
import { HiSearch } from "react-icons/hi";
import { MdClose, MdStar } from "react-icons/md";
import useUtils from "@/utils/useUtils";
import Link from "next/link";
import useUser from "@/utils/useUser";
import { useRouter } from "next/router";
import RenderProduct from "@/components/RenderProduct";

export default function Home() {
  const [addNewProduct, setAddNewProduct] = React.useState(false);
  const [amazonSearchText, setAmazonSearchText] = React.useState("");
  const [amazonResultLoading, setAmazonResultLoading] = React.useState(false);
  const [suggestedProducts, setSuggesstedProducts] = React.useState([]);
  const [amazonResults, setAmazonResults] = React.useState([]);
  const [pinnedProducts, setPinnedProducts] = React.useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  const { executeFunction, formatMoney, trimText } = useUtils();

  const getAmazonResults = async () => {
    if (amazonResultLoading || !amazonSearchText) return;
    setAmazonResultLoading(true);
    try {
      const data = await executeFunction({
        action: "searchProducts",
        searchQuery: amazonSearchText,
      });
      if (data?.data) setAmazonResults(data?.data);
    } catch (err) {
      alert("Amazon data is not available now, please come after some time.");
    }
    setAmazonResultLoading(false);
  };

  const fetchSuggestedProducts = async () => {
    try {
      const data = await executeFunction({
        action: "getSuggestedProducts",
      });
      if (data?.data) setSuggesstedProducts(data?.data);
    } catch (err) {}
  };

  const fetchPinnedProducts = async () => {
    try {
      const data = await executeFunction({
        action: "getPinnedProducts",
      });
      if (data?.data) setPinnedProducts(data?.data);
    } catch (err) {}
  };

  React.useEffect(() => {
    if (!user) router.replace("/login");
  }, [user]);

  React.useEffect(() => {
    fetchSuggestedProducts();
    fetchPinnedProducts();
  }, []);

  return (
    <div className="flex-1 flex flex-col container mx-auto">
      {addNewProduct ? (
        <div
          className={`z-20 transition-opacity duration-300 fixed flex justify-center items-end lg:items-center inset-0 bg-black dark:bg-zinc-500 dark:bg-opacity-50 bg-opacity-50`}
          style={{
            opacity: addNewProduct ? 1 : 0.5,
          }}
        >
          <div className="dark:bg-zinc-900 bg-zinc-50 w-[100%] h-[95%] lg:w-[80%] lg:h-[90%] flex flex-col rounded-md">
            <div className="px-4 py-3 border-b-2 dark:border-zinc-600 flex items-center justify-between">
              <div className="flex items-center">
                <HiSearch className="text-2xl mr-2" />
                <h1 className="font-bold text-xl">Pin the Amazon Product</h1>
              </div>
              <button
                onClick={() => {
                  setAddNewProduct(false);
                }}
              >
                <MdClose className="text-3xl" />
              </button>
            </div>
            <div className="mx-5 flex-1 overflow-y-scroll">
              <div className="flex overflow-hidden rounded-full focus:outline-none mt-4 bg-zinc-100">
                <input
                  onChange={(e) => {
                    setAmazonSearchText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getAmazonResults();
                    }
                  }}
                  value={amazonSearchText}
                  autoFocus={true}
                  placeholder="Search Here..."
                  type="text"
                  className="focus:outline-none px-6 py-3 flex-1 dark:bg-zinc-700 bg-zinc-100"
                  name=""
                  id=""
                />
                <button
                  onClick={getAmazonResults}
                  style={{
                    opacity: amazonResultLoading ? 0.5 : 1,
                  }}
                  className="flex flex-row items-center dark:bg-white dark:text-black bg-blue-500 text-white px-3 font-bold"
                >
                  <HiSearch className="lg:text-2xl" />
                  <p className="ml-1 text-xs lg:text-lg">Search on Amazon</p>
                </button>
              </div>
              {amazonResultLoading ? (
                <>
                  <p className="flex flex-row items-center mt-5 opacity- text-xs">
                    <AiOutlineLoading3Quarters className="animate-spin text-xl mr-2" />
                    <p>Fetching Results. Please Wait.</p>
                  </p>
                </>
              ) : (
                <>
                  <p className="flex flex-row items-center mt-2 opacity-50 text-xs">
                    <AiOutlineEnter className="text-xl mr-2" />
                    <p className="flex-1 text-xs">
                      Press Enter or Press Search to see results. Fetching from
                      Amazon may not work all the time. If you face any issue,
                      retry after some time.
                    </p>
                  </p>
                </>
              )}
              {amazonResults?.length > 0 ? (
                <h1 className="mt-4 font-bold">
                  Amazon Results{" "}
                  <span
                    onClick={() => {
                      setAmazonResults([]);
                    }}
                    className="cursor-pointer font-medium text-xs"
                  >
                    Clear
                  </span>
                </h1>
              ) : suggestedProducts?.length > 0 ? (
                <h1 className="mt-4 font-bold">Suggessted Products</h1>
              ) : null}
              <div className="bg-zinc-50 dark:bg-zinc-900 flex flex-wrap">
                {[
                  ...(amazonResults?.length > 0
                    ? [...amazonResults]
                    : suggestedProducts?.length > 0
                    ? [...suggestedProducts]
                    : []),
                ]?.map((each) => (
                  <div className="w-full lg:w-1/4 flex p-2 lg:p-0">
                    <RenderProduct
                      onPinStatusChange={() => {
                        fetchPinnedProducts();
                      }}
                      each={each}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Head>
        <title>Home</title>
      </Head>
      <div className="mt-5 rounded-full overflow-hidden flex flex-row items-center">
        {/* <div className="flex flex-row items-center rounded-full text-sm px-5 flex-1 dark:bg-zinc-800 bg-zinc-100">
          <HiSearch className="text-xl" />
          <input
            className="ml-3 py-3 w-full dark:bg-zinc-800 bg-zinc-100 focus:outline-none"
            autoFocus
            type="text"
            placeholder="Search Already Pinned Products"
            name=""
            id=""
          />
        </div> */}
        <button
          onClick={() => {
            setAddNewProduct(true);
          }}
          className="flex items-center dark:bg-white dark:text-black rounded-full ml-4 bg-black text-white px-3 py-2 text-sm"
        >
          Pin New Product
          <BsFillPinAngleFill className="ml-2" />
        </button>
      </div>
      {pinnedProducts?.length > 0 ? (
        <div className="mt-5 flex flex-wrap">
          {pinnedProducts?.map((each) => (
            <div className="w-full lg:w-1/4 flex p-2 lg:p-0">
              <RenderProduct
                onPinStatusChange={() => {
                  fetchPinnedProducts();
                }}
                each={each}
              />
            </div>
          ))}
        </div>
      ) : pinnedProducts.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <PiButterflyDuotone className="text-8xl" />
            <p className="text-xs">No Datas Yet</p>
            <button
              onClick={() => {
                setAddNewProduct(true);
              }}
              className="bg-black text-white px-5 py-2 rounded-full mt-5 text-sm"
            >
              Add Data
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
            <p className="text-xs mt-5">Fetching Pinned Data</p>
          </div>
        </div>
      )}
    </div>
  );
}
