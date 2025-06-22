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

export default function TailorProfile({ seamster }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(null);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    let totalRating = 0;
    fetch("http://localhost:8080/api/reviews/seamster/" + seamster._id)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((review) => {
          totalRating += review.rating;
        });
        const avgRating = totalRating / data.length || 0;
        setAvgRating(avgRating);
        setReviews(data);
        console.log("reviews", data);
      });
  }, [reviews]);

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
                      seamster?.profile_picture?.path ||
                      "/default-profile-picture.png"
                    }
                    alt="Profile Picture"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <div className="text-neutral-600 font-medium">
                    {seamster?.first_name + " " + seamster?.last_name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    <span>
                      Joined {formattedJoinedAt ? formattedJoinedAt : null}
                    </span>
                  </div>
                </div>
                <div className="text-2xl bg-neutral-100 p-1 text-neutral-500 rounded-md font-bold flex">
                  {avgRating > 0 ? avgRating.toFixed(1) : 0} ⭐️
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[8rem]  space-y-5">
            {/* <div className="w-full bg-neutral-100 py-6 rounded-md flex justify-between px-24 gap-8">
              <div className="flex flex-col">
                <div className="text-4xl font-bold">20</div>
                <div className="text-sm text-neutral-500">Total works</div>
              </div>
              <div className="flex flex-col">
                <div className="text-4xl font-bold flex">
                  {Math.floor(avgRating)}⭐️
                </div>
                <div className="text-sm text-neutral-500">
                  Average User Rating
                </div>
              </div>
            </div> */}

            <div className="bg-neutral-100 w-full flex flex-col gap-4 rounded-sm px-7 py-5">
              <div className="text-md font-semibold">Information</div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                  <div className="flex gap-1 w-24">
                    <Mail className="h-5 w-5 text-neutral-600" />
                    <div className="font-medium text-neutral-600">Email</div>
                  </div>
                  <div className="font-medium text-neutral-700">
                    {seamster?.email}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex gap-1 w-24">
                    <Phone className="h-5 w-5 text-neutral-600" />
                    <div className="font-medium text-neutral-600">Phone</div>
                  </div>
                  <div className="font-medium text-neutral-700">
                    {seamster?.phone}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex gap-1 w-24">
                    <MapPin className="h-5 w-5 text-neutral-600" />
                    <div className="font-medium text-neutral-600">Location</div>
                  </div>
                  <div className="font-medium text-neutral-700">
                    {seamster?.address.province +
                      ", " +
                      seamster?.address.city +
                      ", " +
                      seamster?.address.street}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-24"></div>
                  <div className="font-medium text-neutral-700">
                    {seamster?.gender}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 rounded-sm py-5">
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <div className="text-base font-semibold">
                    User reviews and ratings
                  </div>
                  <div className="text-md text-neutral-500 font-medium">
                    ({reviews?.length})
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="rounded-full"
                      size="sm"
                    >
                      + Add a review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="mb-4">
                        Share your experience
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <ReviewForm
                        customer_id={user?._id}
                        seamster_id={seamster?._id}
                        setReviews={setReviews}
                      />
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-col gap-6">
                {reviews?.map((review) => {
                  return (
                    <div className="flex gap-2">
                      <Image
                        height={40}
                        width={40}
                        className="rounded-full h-12 w-12 bg-neutral-200"
                        alt="Profile Picture"
                        src={review?.customer_id?.profile_picture?.path}
                      />
                      <div className="flex flex-col gap-1.5">
                        <div className="flex gap-2">
                          <div className="text-neutral-500 font-medium">
                            {review?.customer_id?.first_name +
                              review?.customer_id?.last_name}
                          </div>
                          <div className="">
                            <StarRating rating={review?.rating} />
                          </div>
                        </div>
                        <div className="text-neutral-600 font-medium">
                          {review.comment}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
