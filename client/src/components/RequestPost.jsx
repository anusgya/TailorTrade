"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Hand, Timer, Shirt, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function RequestPost({ post }) {
  const remainingBiddingHours = Math.floor(
    (new Date(post.bidding_due_date) - new Date()) / (1000 * 60 * 60)
  );

  return (
    <div className="flex bg-neutral-50 border w-full cursor-pointer border-neutral-100 gap-3 p-4 rounded-md h-[22rem]">
      {/* image section */}
      <div className="h-full w-[450px] rounded-md bg-neutral-200 overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            layout="fill"
            className="rounded-md object-cover"
            src={post?.image?.path}
            alt="Profile Picture"
          />
        </div>
      </div>

      {/* profile and description section */}
      <div className="w-full h-full">
        <div className="py-2 px-3 flex justify-between">
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-full bg-neutral-200 overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  layout="fill"
                  className="rounded-full object-cover"
                  src={post?.user?.profile_picture?.path}
                  alt="Profile Picture"
                />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-600">
                {post.user?.first_name + " " + post.user?.last_name}
              </div>
              <div className="text-xs font-normal text-neutral-500">
                {post?.user?.address?.city}
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            className="rounded-full flex gap-1"
            // className="rounded-full bg-neutral-900 flex gap-1"
          >
            <Hand className="h-4 w-4" />
            Bid
          </Button>
        </div>
        {/* badge and deadline section */}
        <div className="pl-[3.75rem] pr-3 flex  flex-col">
          <div className="flex flex-col gap-4">
            <div className="py-1 gap-1 flex justify-between">
              <div className="flex gap-1">
                <span className="inline-flex items-center rounded-full bg-gray-200 px-1.5 py-0.5 text-xs  text-gray-600 ring-1 ring-inset font-normal ring-gray-500/10 ">
                  {post.category_name} wear
                </span>

                {/* <span className="inline-flex items-center rounded-full bg-gray-200 px-1.5 py-0.5 text-xs  text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Men's wear
                </span> */}
              </div>
              <div className="flex justify-center items-center gap-1">
                <Timer className="h-5 w-5" />
                <div className="text-sm font-medium">
                  {remainingBiddingHours} Hours Left
                </div>
              </div>
            </div>
            {/* detail and description */}

            <div className="flex flex-col gap-1 text-sm font-medium">
              <div className="flex gap-1 items-center ">
                {/* <Shirt className="h-5 w-5" /> */}
                <span className="text-neutral-600">Request for</span>
                <span>{post?.title}</span>
              </div>
              <div className="flex gap-1 items-center ">
                {/* <Shirt className="h-5 w-5" /> */}
                <span className="text-neutral-600">Fabric</span>
                <span>{post?.fabric}</span>
              </div>
            </div>
            {/* description */}
            <div className="h-[8rem]  text-sm font-normal text-neutral-500">
              <p>{post?.description}</p>
            </div>
          </div>
          {/* total offers */}
          <div className="flex gap-1 font-medium">
            <UsersRound className="h-5 w-5" />
            <div className="text-gray-600 ">Total Offers</div>
            <div>{post.total_offers}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestPost;
