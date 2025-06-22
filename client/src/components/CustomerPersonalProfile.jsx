"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Pencil } from "lucide-react";
import UpdateProfile from "./UpdateProfile";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
export default function CustomerPersonalProfile() {
  const { user } = useAuth();
  // console.log("hehe", user);
  const [userData, setUserData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {}, []);

  const joinedAt = new Date(user?.createdAt);
  let options = {
    // weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  let formattedJoinedAt = joinedAt.toLocaleDateString("en-US", options);

  return (
    <div className="w-screen flex flex-col items-center pb-[30rem]">
      <div className="bg-teal-900 w-full h-[10rem] flex relative justify-center">
        <div className="absolute top-[7rem] flex flex-col items-center gap-1.5">
          <div className="h-[6.5rem] w-[6.5rem] rounded-full bg-neutral-200 ">
            <div className="relative w-full h-full">
              <Image
                layout="fill"
                className="rounded-full object-cover"
                src={
                  user?.profile_picture?.path || "/default-profile-picture.png"
                }
                alt="Profile Picture"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-neutral-600 font-medium">
              {user?.first_name + " " + user?.last_name}
            </div>
            <div className="flex gap-1 text-xs text-neutral-500">
              {/* <span>
                {user?.address.city +
                  ", " +
                  user?.address.province +
                  ", " +
                  user?.address.street}
              </span> */}
              {/* <span className="h-4 w-[1px] bg-neutral-400"></span> */}
              <span>Joined {formattedJoinedAt}</span>
            </div>
          </div>
        </div>
      </div>
      {/* section starting message button and below */}
      <div className="flex flex-col mt-[8rem] w-[35rem] gap-5 items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-full flex gap-2">
              <Pencil className="h-5 w-5" />
              Edit Information
            </Button>
          </DialogTrigger>
          <DialogContent className="p-12">
            <UpdateProfile userData={user} />
          </DialogContent>
        </Dialog>
        <div className="bg-neutral-100 w-full flex flex-col gap-4 rounded-sm px-7 py-5">
          <div className="text-md font-semibold">Information</div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="flex gap-1">
                <Mail className="h-5 w-5 text-neutral-600" />
                <div className="font-medium text-neutral-600">Email</div>
              </div>
              <div className="font-medium text-neutral-700 ">{user?.email}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-1">
                <Phone className="h-5 w-5 text-neutral-600" />
                <div className="font-medium text-neutral-600">Phone</div>
              </div>
              <div className="font-medium text-neutral-700">{user?.phone}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-1">
                <MapPin className="h-5 w-5 text-neutral-600" />
                <div className="font-medium text-neutral-600">Location</div>
              </div>
              <div className="font-medium text-neutral-700">
                {user?.address.city +
                  ", " +
                  user?.address.province +
                  ", " +
                  user?.address.street}
              </div>
            </div>
            {/* <div className="flex justify-between">
              <div className="flex gap-1">
                <User className="h-5 w-5 text-neutral-600" />
                <div className="font-medium text-neutral-600">Gender</div>
              </div>
              <div className="font-medium text-neutral-700">Male</div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
