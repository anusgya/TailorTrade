import React, { useEffect } from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// useEffect(()=>{
//   fetch("")
// })

function OrderCard({ order }) {
  console.log("recent order", order);
  return (
    <div className="bg-neutral-100/50 w-full  border border-neutral-100  rounded-lg">
      <div className="">
        <div
          className="relative 
         bg-neutral-100 overflow-hidden w-full h-60"
        >
          <Image
            layout="fill"
            className="object-cover  rounded-t-md"
            src={order?.post_id?.image?.path}
            alt="post-image"
          />
        </div>
      </div>
      <div className=" flex justify-between p-4 items-baseline">
        <div>
          <div className="text-base font-medium text-neutral-700">
            {order?.post_id?.title}
          </div>
          <div className="text-sm text-neutral-500">
            {" "}
            {order?.post_id?.fabric}
          </div>
        </div>
        {order?.order_status === "cancelled" ? (
          <Badge variant="destructive">Cancelled</Badge>
        ) : order?.order_status === "in-progress" ? (
          <Badge variant="secondary">In-progress</Badge>
        ) : (
          <Badge variant="default">Completed</Badge>
        )}

        {/* <Button variant="ghost" size="sm" className="rounded-full">
          view status
        </Button> */}
      </div>
    </div>
  );
}

export default OrderCard;
