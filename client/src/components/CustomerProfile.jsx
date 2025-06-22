"use client";
import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Send, User } from "lucide-react";

import { Pencil } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, StarHalf } from "lucide-react";
import Rating from "react-rating";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReviewForm } from "./ReviewForm";
import { set } from "date-fns";

const StarRating = ({ rating }) => {
  const ratingStar = Array.from({ length: 5 }, (elem, index) => {
    let number = index + 0.5;
    return (
      <span key={index}>
        {rating >= index + 1 ? (
          <Star className="h-5 w-5" fill="#FFC300" strokeWidth={0} />
        ) : rating >= number ? (
          <StarHalf className="h-5 w-5" fill="#FFC300" strokeWidth={0} />
        ) : (
          // <AiOutlineStar className="text-yellow-500" />
          " "
        )}
      </span>
    );
  });

  return <div className="flex">{ratingStar}</div>;
};

export default function CustomerProfile({ customer }) {
  const { user } = useAuth();

  const joinedAt = new Date(user?.createdAt);
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  let formattedJoinedAt = joinedAt.toLocaleDateString("en-US", options);
  return (
    <div className="w-full h-[calc(100vh-64px)] text-neutral-600">
      <ScrollArea className="h-full">
        <div className="">
          <div className="bg-teal-900 w-full h-[10rem] relative">
            <div className="absolute top-[7rem] flex flex-col left-2  items-start gap-4">
              <div className="h-[6.5rem] w-[6.5rem] rounded-full bg-neutral-200 ">
                <div className="relative w-full h-full">
                  <Image
                    layout="fill"
                    className="rounded-full object-cover"
                    src={
                      customer?.profile_picture?.path ||
                      "/default-profile-picture.png"
                    }
                    alt="Profile Picture"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <div className="text-neutral-600 font-medium">
                    {customer?.first_name + " " + customer?.last_name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    <span>
                      Joined {formattedJoinedAt ? formattedJoinedAt : null}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[8rem]  space-y-5">
            <div className="bg-neutral-100 w-full flex flex-col gap-4 rounded-sm px-7 py-5">
              <div className="text-md font-semibold">Information</div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                  <div className="flex gap-1 w-24">
                    <Mail className="h-5 w-5 text-neutral-600" />
                    <div className="font-medium text-neutral-600">Email</div>
                  </div>
                  <div className="font-medium text-neutral-700">
                    {customer?.email}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex gap-1 w-24">
                    <Phone className="h-5 w-5 text-neutral-600" />
                    <div className="font-medium text-neutral-600">Phone</div>
                  </div>
                  <div className="font-medium text-neutral-700">
                    {customer?.phone}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex gap-1 w-24">
                    <MapPin className="h-5 w-5 text-neutral-600" />
                    <div className="font-medium text-neutral-600">Location</div>
                  </div>
                  <div className="font-medium text-neutral-700">
                    {customer?.address.province +
                      ", " +
                      customer?.address.city +
                      ", " +
                      customer?.address.street}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-24"></div>
                  <div className="font-medium text-neutral-700">
                    {customer?.gender}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
