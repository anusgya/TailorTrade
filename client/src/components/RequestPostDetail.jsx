"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock,
  Palette,
  Ruler,
  Shirt,
  Target,
  Timer,
  UserPlus,
  Users,
} from "lucide-react";
import { Input } from "./ui/input";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { sendNotification } from "@/utils/notificationUtils";

// Add 'post' prop for details
export default function RequestPostDetail({ post }) {
  const { toast } = useToast();

  const { user } = useAuth();
  console.log("this is user", user);
  const [totalOffers, setTotalOffers] = useState(post.total_offers);
  // console.log(user._id);
  // console.log(post._id);
  const [bid, setBid] = useState({
    post_id: post._id,
    bid_amount: 0,
    seamster_id: user._id,
  });

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  if (!post) return <div>Loading...</div>; // Return loading state if no post data

  const remainingBiddingHours = Math.floor(
    (new Date(post.bidding_due_date) - new Date()) / (1000 * 60 * 60)
  );

  const requiredByDate = new Date(post?.required_by);
  let options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  let formattedRequiredBy = requiredByDate.toLocaleDateString("en-US", options);

  // console.log("requiredByInDate", formattedDate);

  const handleChange = (value) => {
    setBid({ ...bid, bid_amount: value });
  };

  console.log(bid);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/bids/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bid),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        showToast("Bid submitted successfully", "success");
        sendNotification(
          user._id,
          post.user._id,
          "neutral",
          `You have received a new offer of NPR ${
            bid.bid_amount
          } for your request of  ${post.fabric + " " + post.title}.`
        );
        const response2 = await fetch(
          `http://localhost:8080/api/posts/offers/${post._id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response2.ok) {
          const data2 = await response2.json();
          setTotalOffers(data2.total_offers);
        }
      }
    } catch (error) {
      showToast(error.message, "destructive");
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 gap-3 flex flex-col px-11 py-8">
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-full bg-neutral-200 overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                layout="fill"
                className="rounded-full object-cover"
                src={post.user?.profile_picture?.path}
                alt="Profile Picture"
              />
            </div>
          </div>
          <div>
            <div className="text-base font-medium">
              {post.user?.first_name + " " + post.user?.last_name}
            </div>
            <div className="text-xs text-neutral-500">
              {post.user?.address.city}
            </div>
          </div>
        </div>
        <div>
          <Image
            height={400}
            width={400}
            src={post.image.path || "/default-image.jpg"}
            className="h-[25rem]"
            onClick={() => console.log("wohoooo")}
            alt="Post Image"
          />
        </div>
        <div className="text-neutral-600 ">{post.description}</div>
      </div>
      <div className="flex-1 flex flex-col px-9  rounded-sm py-8 gap-5  h-full bg-neutral-100">
        <div className="text-2xl font-medium">{post.title}</div>
        <div className="flex gap-1">
          <span className="inline-flex items-center rounded-full bg-gray-200 px-1.5 py-0.5 text-xs  text-gray-600 ring-1 ring-inset ring-gray-500/10 ">
            {post.category_name} wear
          </span>

          {/* <span className="inline-flex items-center rounded-full bg-gray-200 px-1.5 py-0.5 text-xs  text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Men's wear
                </span> */}
        </div>
        <div className="py-2 flex flex-col gap-[0.75rem] ">
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Shirt className="h-5 w-5 text-neutral-600" />
              <div className="font-medium text-neutral-500">Fabric</div>
            </div>
            <div className="text-neutral-700 font-medium">{post.fabric}</div>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Palette className="h-5 w-5 text-neutral-600" />
              <div className="font-medium text-neutral-500">Color</div>
            </div>
            <div className="text-neutral-700 font-medium">{post.color}</div>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Target className="h-5 w-5 text-neutral-700" />
              <div className="font-medium text-neutral-500">Pattern</div>
            </div>
            <div className="font-medium text-neutral-700">{post.pattern}</div>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Ruler className="h-5 w-5 text-neutral-700" />
              <div className="font-medium text-neutral-500">Size</div>
            </div>
            <div className="font-medium text-neutral-700">{post.size}</div>
          </div>
        </div>
        <div className="py-3 flex gap-2">
          <div className="flex gap-1">
            <CalendarClock className="h-5 w-5 text-neutral-500" />
            <div className="font-medium text-neutral-500">Required By</div>
          </div>
          <div className="font-medium text-neutral-700">
            {formattedRequiredBy}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Input type="number" onChange={(e) => handleChange(e.target.value)} />
          <Button onClick={(e) => handleBidSubmit(e)}>Make an Offer</Button>
        </div>
        <div className="flex justify-between ">
          <div className="flex gap-1">
            <Timer className="h-5 w-5 text-neutral-600" />
            <div className="font-medium text-neutral-700">
              {remainingBiddingHours} hours left
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Users className="h-5 w-5 text-neutral-600" />
              <div className="font-medium text-neutral-500">Total Offers</div>
            </div>
            <div className="font-medium">{totalOffers}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
