"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Inclusive_Sans } from "next/font/google";
import { useAuth } from "@/context/AuthContext";
import { set } from "date-fns";

export default function Login() {
  const { setUser, setLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setLoading(false);
        showToast("Logged in successfully", "success");
        // console.log(data.user.user_role);
        if (data.user.user_role === "seamster") router.push("/seamster/home");
        else {
          router.push("/customer/home");
        }
      } else {
        showToast("Invalid Credentials", "destructive");
      }
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center w-96 space-y-12 -mt-40">
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-semibold text-xl text-gray-700">
            {" Login To TailorTrade"}
          </h1>
          <p className="text-gray-500 text-sm">
            {" Just a sec & we'll let you be on your way"}
          </p>
        </div>
        <form
          onChange={handleChange}
          onSubmit={handleSubmit}
          className="grid w-full space-y-2  items-center gap-1.5"
        >
          <div>
            <Label htmlFor="email">{"Email"}</Label>
            <Input
              type="email"
              id="email"
              placeholder="Eg: johndoe@gmail.com"
            />
          </div>
          <div>
            <Label htmlFor="password">{"Password"}</Label>
            <Input type="password" id="password" placeholder="**********" />
          </div>
          <Button type="submit">{"Submit"}</Button>
          <div className="w-full flex justify-center items-center"></div>
          <div className="w-full flex mt-4 justify-center items-center">
            <p className="text-xs">
              Don't have an account?
              <Link href={"/auth/register"}>
                <span className="font-medium cursor-pointer text-teal-900 hover:text-teal-800">
                  {" "}
                  Be a member
                </span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
