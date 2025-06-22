"use client";
import Link from "next/link";
import { useContext } from "react";
import AuthProvider from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import Login from "./auth/login/page";
import { useEffect, useState } from "react";

export default function App() {
  const user = useAuth();
  if (user) {
    console.log("it workssss");
  } else {
    console.log("it does not work");
  }

  return (
    <div>
        <Login />
    </div>
  );
}
