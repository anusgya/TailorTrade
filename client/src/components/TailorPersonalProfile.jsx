"use client";
import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Send, User } from "lucide-react";
import { Pencil } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import { Button } from "./ui/button";
import { Star, StarHalf } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UpdateProfile from "./UpdateProfile";

import { useAuth } from "@/context/AuthContext";
// import { AspectRatio } from "./ui/aspect-ratio";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Rating from "react-rating";
import { ReviewForm } from "./ReviewForm";
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

export default function TailorProfile() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(null);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    if (user) {
      let totalRating = 0;
      fetch("http://localhost:8080/api/reviews/seamster/" + user?._id)
        .then((res) => res.json())
        .then((data) => {
          data.forEach((review) => {
            totalRating += review.rating;
          });
          const avgRating = totalRating / data.length || 0;
          setAvgRating(avgRating);
          setReviews(data);
          // console.log("reviewsssssssss", data);
        });
    }
  }, [user]);

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
              {/* <span>Durbarmarg</span> */}
              {/* <span className="h-4 w-[1px] bg-neutral-400"></span> */}
              <span>Joined {formattedJoinedAt ? formattedJoinedAt : null}</span>
            </div>
          </div>
        </div>
      </div>
      {/* section starting message button and below */}
      <div className="flex flex-col mt-[8rem] w-[35rem] gap-5 items-center">
        {/* message */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-full flex gap-2">
              <Pencil className="h-5 w-5" />
              Edit Information
            </Button>
          </DialogTrigger>
          <DialogContent className="p-12">
            <ScrollArea>
              <UpdateProfile userData={user} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
        {/* <div className="text-sm text-neutral-500 text-center">
          Hello there! I'm John, your friendly neighborhood tailor, dedicated to
          crafting garments that not only fit impeccably but also exude
          individuality and style. With years of experience and a passion for
          the art of tailoring, I thrive on the challenge of bringing your
          sartorial visions to life. Whether it's a bespoke suit for a special
          occasion or alterations to perfect your everyday wear, I approach each
          project with meticulous attention to detail and a commitment to
          exceeding your expectations.
        </div> */}
        <div className=" px-24 justify-between bg-neutral-100 py-6 rounded-md flex ">
          {/* <div className="flex flex-col items-center ">
            <div className="text-4xl font-bold">20</div>
            <div className="text-sm text-neutral-500">Total works</div>
          </div> */}
          <div className="flex flex-col items-center ">
            <div className="text-4xl font-bold">
              {/* {Math.floor(avgRating)} ⭐️ */}
              {avgRating > 0 ? avgRating.toFixed(1) : 0} ⭐️
            </div>
            <div className="text-sm text-neutral-500">Average User Rating</div>
          </div>
        </div>

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
                {user?.address.province +
                  ", " +
                  user?.address.city +
                  ", " +
                  user?.address.street}
              </div>
            </div>
            <div className="flex justify-between">
              {/* <div className="flex gap-1">
                <User className="h-5 w-5 text-neutral-600" />
                <div className="font-medium text-neutral-600">Gender</div>
              </div> */}
              <div className="font-medium text-neutral-700">{user?.gender}</div>
            </div>
          </div>
        </div>
        <div className=" w-full flex flex-col gap-4 rounded-sm  py-5 px-3">
          <div className=" text-lg font-semibold">User reviews and ratings</div>
          <div className="flex flex-col gap-6">
            {reviews?.map((review) => {
              return (
                <div className="flex gap-2">
                  <div className="h-12 w-12 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image
                        layout="fill"
                        className="rounded-full object-cover"
                        src={review?.customer_id?.profile_picture?.path}
                        alt="Profile Picture"
                      />
                    </div>
                  </div>
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
  );
}
