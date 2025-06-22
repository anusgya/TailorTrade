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
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function OrderDetail({ order }) {
  return (
    <div className="w-full h-full flex">
      <div className="flex-1 gap-3 flex flex-col px-11 py-8">
        <div className="flex gap-2">
          <div className="h-12 w-12 rounded-full bg-neutral-200 overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                layout="fill"
                className="rounded-full object-cover"
                src={order.customer_id.profile_picture.path}
                alt="Profile Picture"
              />
            </div>
          </div>
          <div>
            <div className="text-base">
              {order.customer_id.first_name + " " + order.customer_id.last_name}
            </div>
            <div className="text-xs text-neutral-500">
              {order.customer_id.address.city}
            </div>
          </div>
        </div>
        <div>
          <Image
            height={400}
            width={400}
            src={order.post_id.image.path || "/default-image.jpg"}
            className="h-[25rem]"
            onClick={() => console.log("wohoooo")}
            alt="Post Image"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col px-9  justify-between rounded-sm py-8 gap-5  h-full bg-neutral-100">
        <div className="text-2xl font-medium">{order.post_id.title}</div>
        <div className="flex gap-1">
          <span className="inline-flex items-center rounded-full bg-gray-200 px-1.5 py-0.5 text-xs  text-gray-600 ring-1 ring-inset ring-gray-500/10 ">
            {order.post_id.category_name} wear
          </span>
        </div>
        <div className="py-2 flex flex-col gap-[0.75rem] ">
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Shirt className="h-5 w-5 text-neutral-600" />
              <div className="font-medium text-neutral-500">Fabric</div>
            </div>
            <div className="text-neutral-700 font-medium">
              {order.post_id.fabric}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Palette className="h-5 w-5 text-neutral-600" />
              <div className="font-medium text-neutral-500">Color</div>
            </div>
            <div className="text-neutral-700 font-medium">
              {order.post_id.color}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Target className="h-5 w-5 text-neutral-700" />
              <div className="font-medium text-neutral-500">Pattern</div>
            </div>
            <div className="font-medium text-neutral-700">
              {order.post_id.pattern}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Ruler className="h-5 w-5 text-neutral-700" />
              <div className="font-medium text-neutral-500">Size</div>
            </div>
            <div className="font-medium text-neutral-700">
              {order.post_id.size}
            </div>
          </div>
        </div>
        <div className="text-neutral-500 h-[7.5rem] ">
          {order.post_id.description}
        </div>
        <div className="py-3 flex gap-2">
          <div className="flex gap-1">
            <CalendarClock className="h-5 w-5 text-neutral-500" />
            <div className="font-medium text-neutral-500">Required By</div>
          </div>
          <div className="font-medium text-neutral-700">
            {order.post_id?.required_by}
          </div>
        </div>
      </div>
    </div>
  );
}
