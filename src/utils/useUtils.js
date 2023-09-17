import React from "react";
import axios from "axios";

import { Client, Functions } from "appwrite";
import useUser from "./useUser";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("650544da77c938948ffe");

const functions = new Functions(client);

export default function useUtils() {
  const { user, setUser } = useUser();
  const executeFunction = async (data) =>
    new Promise((resolve, reject) => {
      let sendData = JSON.stringify({
        data: JSON.stringify(
          user ? { ...data, userToken: user?.jwt_token } : data
        ),
      });

      let config = {
        method: "post",
        url: "https://cloud.appwrite.io/v1/functions/65057b15324c4754d715/executions",
        headers: {
          "X-Appwrite-Project": "650544da77c938948ffe",
          "Content-Type": "application/json",
        },
        data: sendData,
      };

      axios
        .request(config)
        .then(({ data }) => {
          if (data?.statusCode === 500) reject("Something went wrong");

          if (data?.response) {
            const reponseData = JSON.parse(data?.response);
            resolve(reponseData);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

  const trimText = (string, length) => {
    if (string?.length > length) return string?.substring(0, length) + "...";
    else return string;
  };

  const formatMoney = (number) => {
    try {
      const toBeParsed = parseInt(number);
      const formattedNumber = toBeParsed.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      });
      return formattedNumber;
    } catch (err) {
      return number;
    }
  };
  return {
    executeFunction,
    formatMoney,
    trimText,
  };
}
