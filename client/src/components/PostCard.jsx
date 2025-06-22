import React, { useEffect } from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// useEffect(()=>{
//   fetch("")
// })

function PostCard({ post }) {
  const remainingBiddingHours = Math.floor(
    (new Date(post.bidding_due_date) - new Date()) / (1000 * 60 * 60)
  );
  console.log("recent post", post);
  return (
    <div className="bg-neutral-100/50 w-full  border border-neutral-100  rounded-lg">
      <div className="">
        <div
          className="relative 
         bg-neutral-100 overflow-hidden w-full   h-60"
        >
          <Image
            layout="fill"
            className="object-cover  rounded-t-md"
            src={post?.image?.path}
            alt="post-image"
          />
        </div>
      </div>
      <div className=" flex justify-between p-4 items-baseline">
        <div>
          <div className="text-base font-medium text-neutral-700">
            {post?.title}
          </div>
          <div className="text-sm text-neutral-500">{post?.fabric}</div>
        </div>

        <Badge
          className={
            remainingBiddingHours > 0 ? "text-neutral-600  " : "text-red-600 "
          }
          variant="secondary"
        >
          {" "}
          {remainingBiddingHours > 0
            ? remainingBiddingHours + " hours left"
            : "Bidding's closed"}{" "}
        </Badge>
      </div>
    </div>
  );
}

export default PostCard;
