// "use client";

import React from "react";
import Image from "next/image";
// import TailorNav from "@/components/TailorNav";
import TailorNav from "@/components/TailorNav";



export default function Statistics() {
  return (
    <div className="w-screen h-screen">
      <TailorNav />
      <div className="w-screen flex flex-col px-[7rem] py-[2rem] gap-[3rem]">
        <div>
          <div className="text-lg font-medium text-neutral-700">Bids</div>
          <div className="text-sm text-neutral-500">
            Your bids history till today
          </div>
        </div>
        <div className="bg-neutral-100 flex gap-[5rem] items-center justify-center rounded-lg w-full px-[10rem] py-[4rem]">
          <div className="w-full flex flex-col gap-[5rem] items-between ">
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-5xl">30</div>
              <div className="font-medium text-md text-neutral-500">
                Total Bids Made
              </div>
            </div>
            {/* <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-5xl">4.7⭐️</div>
              <div className="font-medium text-md text-neutral-500">
                Average User Rating
              </div>
            </div> */}
          </div>
          <div className="w-full flex gap-[5rem] flex-col justify-between ">
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-5xl">20</div>
              <div className="font-medium text-md text-neutral-500">
                Total Bids Won
              </div>
            </div>
            {/* <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-5xl">3</div>
              <div className="font-medium text-md text-neutral-500">
                Repeating Customers
              </div>
            </div> */}
          </div>
          <div className="w-full flex flex-col gap-[5rem] justify-between ">
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-5xl">80%</div>
              <div className="font-medium text-md text-neutral-500">
                Success Rate
              </div>
            </div>
            {/* 
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-5xl">Rs 34,000</div>
              <div className="font-medium text-md text-neutral-500">
                Total revenue generated
              </div>
            </div> */}
          </div>
        </div>

        {/* Current Orders */}

      </div>
    </div>
  );
}
