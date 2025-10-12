"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { OnSaveContext } from "@/context/OnSaveContext";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [onSaveData, setOnSaveData] = useState<any>(null);
  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    const result = await axios.post("/api/users", {});
    console.log(result.data);
    setUserDetails(result.data?.user);
  };

  return (
    <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
      <OnSaveContext.Provider value={{ onSaveData, setOnSaveData }}>
        {children}
      </OnSaveContext.Provider>
    </UserDetailsContext.Provider>
  );
};

export default Provider;
