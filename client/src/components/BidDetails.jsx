"use client";

import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";
import { sendNotification } from "../utils/notificationUtils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useEffect } from "react";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { date } from "zod";
import TailorProfile from "./TailorProfile";

function BidDetails({ bidDetails, isOrdered, setOrdered, totalBids, postID }) {
  const { user } = useAuth();
  const user_id = user?._id;
  const router = useRouter();
  const { toast } = useToast();

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  const [acceptedBidId, setAcceptedBidId] = useState();

  const handleAcceptBid = async (bid_id, seamster_id, bid_amount) => {
    try {
      const bidResponse = await fetch(
        `http://localhost:8080/api/bids/accept/${bid_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!bidResponse.ok) {
        throw new Error("Error accepting bid");
      }

      await sendNotification(
        user?._id,
        seamster_id,
        "positive",
        `Your bid of NPR ${bid_amount} has been accepted. An order has been placed.`
      );

      showToast("Bid accepted successfully", "success");
      setOrdered(true);
      setAcceptedBidId(bid_id);

      const orderResponse = await fetch("http://localhost:8080/api/orders/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postID,
          customer_id: user_id,
          seamster_id: seamster_id,
          price: bid_amount,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Error placing order");
      }

      showToast("Order placed successfully", "success");
      console.log(postID, user_id, seamster_id, bid_amount);
    } catch (error) {
      showToast(error.message, "destructive");
    }
  };

  return (
    <div className="w-full overflow-x-auto flex justify-center border border-neutral-200 rounded-lg px-10 py-4 transform">
      {/* <div className=""> */}
      {totalBids !== 0 ? (
        <table className="w-full h-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900 sm:pl-0"
              >
                Seamsters
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
              >
                Offered Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {bidDetails &&
              bidDetails?.map((bidDetail) => (
                <tr key={bidDetail._id}>
                  <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-neutral-200 overflow-hidden">
                        <div className="relative w-full h-full">
                          <Image
                            layout="fill"
                            className="rounded-full object-cover"
                            src={bidDetail.seamster_id?.profile_picture?.path}
                            alt="Profile Picture"
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        {/* <Button variant="link" className="p-0 h-0"> */}
                        <Sheet>
                          <SheetTrigger>
                            {" "}
                            <div className="font-medium text-normal text-gray-700">
                              {bidDetail.seamster_id.first_name +
                                " " +
                                bidDetail.seamster_id.last_name}
                            </div>
                          </SheetTrigger>
                          <SheetContent className="w-[35rem] pr-12">
                            <SheetHeader>
                              <SheetTitle className="mb-6"></SheetTitle>
                              <SheetDescription>
                                <TailorProfile
                                  seamster={bidDetail.seamster_id}
                                />
                              </SheetDescription>
                            </SheetHeader>
                          </SheetContent>
                        </Sheet>
                        {/* </Button> */}
                        <div className="mt-1 text-gray-500">
                          {bidDetail.seamster_id.address.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div className="text-gray-800 text-base font-medium">
                      NPR {bidDetail.bid_amount}
                    </div>
                  </td>
                  <td className=" flex self-end py-5 -mr-12">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        {
                          <Button
                            className={
                              isOrdered
                                ? bidDetail.is_accepted ||
                                  acceptedBidId === bidDetail._id
                                  ? "pointer-events-none bg-teal-800 rounded-full"
                                  : "rounded-full pointer-events-none bg-neutral-500"
                                : "rounded-full"
                            }
                            variant="secondary"
                            size="sm"
                          >
                            {bidDetail.is_accepted ||
                            acceptedBidId === bidDetail._id
                              ? "Accepted"
                              : "Accept"}
                          </Button>
                        }
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            You are about to place an order.
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Accepting this bid will place an order with the
                            seamster. Are you sure you want to proceed?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleAcceptBid(
                                bidDetail._id,
                                bidDetail.seamster_id,
                                bidDetail.bid_amount
                              )
                            }
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="text-neutral-500 font-semibold text-xl">
          No bids yet
        </div>
      )}
      {/* </div> */}
    </div>
  );
}

export default BidDetails;
