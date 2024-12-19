import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";
export function useUser() {
  const [payingStatus, setPayingStatus] = useState<boolean>(false);

  const getPayingStatus = async () => {
    const token = await auth.currentUser?.getIdToken();
    console.log("getPayingStatus token", token);
    const response = await fetch(`${BACKEND_URL}/user/paying_status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setPayingStatus(data.payingStatus);
  };

  return {
    payingStatus,
    getPayingStatus,
  };
}
