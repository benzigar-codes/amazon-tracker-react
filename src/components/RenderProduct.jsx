import useUser from "@/utils/useUser";
import useUtils from "@/utils/useUtils";
import Link from "next/link";
import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsCheck, BsFillPinFill } from "react-icons/bs";
import { MdStar } from "react-icons/md";

export default function RenderProduct({
  each = {},
  onPinStatusChange = () => {},
}) {
  const { formatMoney, trimText, executeFunction } = useUtils();
  const [pinnedStatus, setPinnedStatus] = React.useState(null);
  const [pinLoading, setPinLoading] = React.useState(false);
  const { user, setUser } = useUser();

  const pinProduct = async () => {
    setPinLoading(true);
    const sendData = {
      action: "pinProduct",
      productId: each?.$id,
      pinStatus: !pinnedStatus,
    };
    try {
      const data = await executeFunction(sendData);
    } catch (err) {}
    setPinnedStatus(!pinnedStatus);
    setPinLoading(false);
    onPinStatusChange();
  };

  const checkPinStatus = async () => {
    try {
      const data = await executeFunction({
        action: "checkPinned",
        productId: each.$id,
      });
      setPinnedStatus(data?.pinStatus);
    } catch (er) {}
  };

  React.useEffect(() => {
    checkPinStatus();
  }, []);

  return (
    <div className="flex flex-col justify-between m-2 dark:bg-zinc-800 bg-white rounded-md overflow-hidden">
      <div className="flex flex-col">
        <div className="bg-white relative">
          <img
            style={{
              objectFit: "contain",
            }}
            className="py-3 aspect-square w-full object-cover"
            src={each?.image}
            alt=""
          />
        </div>
        <div className="p-2 dark:bg-zinc-800 bg-white hover:bg-zinc-50">
          <Link
            target="_blank"
            href={each.link}
            className="hover:underline cursor-pointer font-bold"
          >
            {trimText(each.name, 100)}
          </Link>
        </div>
        <div className="p-2 flex justify-between items-center">
          {each.rating ? (
            <p className="text-sm flex flex-row items-center">
              <MdStar className="mr-1" />
              <span className="font-bold">{each.rating}</span>({each.reviews})
            </p>
          ) : null}
          <p className="font-bold">{formatMoney(each.price)}</p>
        </div>
      </div>
      <div className="p-2 flex flex-col">
        {pinLoading === true ? (
          <div className="w-full flex flex-col">
            <button
              onClick={() => {
                if (window.confirm("Do you want to unpin this ? "))
                  pinProduct();
              }}
              className="flex items-center justify-center py-1 rounded-md mt-2 dark:bg-zinc-900 dark:text-white bg-zinc-200 text-black"
            >
              <AiOutlineLoading3Quarters className="mr-2 animate-spin text-sm" />
              <p>Loading...</p>
            </button>
          </div>
        ) : pinnedStatus === true ? (
          <div className="w-full flex flex-col">
            <button
              onClick={() => {
                if (window.confirm("Do you want to unpin this ? "))
                  pinProduct();
              }}
              className="flex items-center justify-center py-1 rounded-md mt-2 dark:bg-zinc-900 dark:text-white bg-zinc-200 text-black"
            >
              <BsCheck className="text-3xl" />
              <p>Pinned</p>
            </button>
          </div>
        ) : pinnedStatus === false ? (
          <div onClick={pinProduct} className="w-full flex flex-col">
            <button className="flex items-center justify-center py-1 rounded-md mt-2 bg-blue-600 text-white">
              <BsFillPinFill />
              <p className="ml-2">Pin this</p>
            </button>
          </div>
        ) : (
          <div className="opacity-0 w-full flex flex-col">
            <button className="flex items-center justify-center py-1 rounded-md mt-2 bg-blue-600 text-white">
              <BsFillPinFill />
              <p className="ml-2">Pin this</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
