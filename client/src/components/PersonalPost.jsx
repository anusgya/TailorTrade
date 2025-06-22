"use client";

import React from "react";
// import Image from "next/image";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Hand, Timer, Shirt, UsersRound } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import BidDetails from "./BidDetails";
import { useToast } from "@/components/ui/use-toast";

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
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function PersonalPost({ post }) {
  const { user } = useAuth();
  const remainingBiddingHours = Math.floor(
    (new Date(post.bidding_due_date) - new Date()) / (1000 * 60 * 60)
  );

  const [bids, setBids] = useState(null);
  const [postID, setPostID] = useState(post._id);
  const { toast } = useToast();
  const router = useRouter();
  const [ordered, setOrdered] = useState(false);
  const totalBids = bids?.length;

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    fetch(`http://localhost:8080/api/posts/${postID}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
          showToast("Post deleted successfully", "success");
        } else {
          throw new Error("Failed to delete the post");
        }
      })
      .catch((error) => {
        showToast(error.message, "destructive");
      });
  };

  useEffect(() => {
    if (postID) {
      fetch(`http://localhost:8080/api/bids/post/${postID}`)
        .then((res) => res.json())
        .then((data) => {
          data.map((bid) => {
            if (bid.is_accepted === true) {
              setOrdered(true);
            }
          });
          setBids(data);
        })
        .catch((error) => {
          console.error("Error fetching bids:", error);
        });
    }
  }, [postID]);

  const handleViewBids = (newPostID) => {
    setPostID(newPostID);
  };

  return (
    <div className="flex bg-neutral-50 border w-full cursor-pointer border-neutral-100 gap-3 p-4 rounded-md h-[23rem]">
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

      <div className="w-full h-full">
        <div className="py-2 px-3 flex justify-between">
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-full bg-neutral-200 overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  layout="fill"
                  className="rounded-full object-cover"
                  src={user?.profile_picture.path}
                  alt="Profile Picture"
                />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-600">
                {post.user?.first_name + " " + post.user?.last_name}
              </div>
              <div className="text-xs text-neutral-500">
                {post?.user?.address?.city}
              </div>
            </div>
          </div>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost">{<Trash2 />}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to delete a post. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-500"
                    onClick={(e) => handleDelete(e)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="rounded-full flex gap-1"
                  variant="secondary"
                  onClick={() => handleViewBids(post._id)}
                >
                  {/* <Hand className="h-4 w-4" /> */}
                  View Bids
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[52rem] h-[40rem] p-12">
                <ScrollArea>
                  <BidDetails
                    bidDetails={bids}
                    isOrdered={ordered}
                    setOrdered={setOrdered}
                    totalBids={totalBids}
                    postID={post._id}
                  />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* badge and deadline section */}
        <div className="pl-[3.75rem] pr-3 flex  flex-col">
          <div className="flex flex-col gap-4">
            <div className="py-1 gap-1 flex justify-between">
              <div className="flex gap-1">
                <span className="inline-flex items-center rounded-full bg-gray-200 px-1.5 py-0.5 text-xs  text-gray-600 ring-1 ring-inset ring-gray-500/10 ">
                  {post.category_name} wear
                </span>
              </div>
            </div>
            {/* detail and description */}
            <div className="flex flex-col gap-1 text-sm font-medium">
              <div className="flex gap-1 items-center ">
                {/* <Shirt className="h-5 w-5" /> */}
                <span className="text-neutral-600">Request for</span>
                <span>{post.title}</span>
              </div>
              <div className="flex gap-1 items-center ">
                {/* <Shirt className="h-5 w-5" /> */}
                <span className="text-neutral-600">Fabric</span>
                <span>{post.fabric}</span>
              </div>
            </div>
            {/* description */}
            <div className="h-[7rem]  text-sm text-neutral-500">
              <p>{post.description}</p>
            </div>
          </div>
          {/* total offers */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <div className="flex gap-1 font-medium">
              <UsersRound className="h-5 w-5" />
              <div className="text-gray-600 ">Total Offers</div>
              <div>{post.total_offers || bids?.length}</div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <Timer
                className={
                  remainingBiddingHours > 0 ? "h-5 w-5" : "text-red-600"
                }
              />
              <div
                className={
                  remainingBiddingHours > 0
                    ? "text-neutral-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {remainingBiddingHours > 0
                  ? remainingBiddingHours + " hours left"
                  : "Bidding's closed"}{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalPost;
