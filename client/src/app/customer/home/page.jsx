"use client";
// import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import RequestPost from "@/components/RequestPost";
import TailorSideBar from "@/components/TailorSideBar";
import { useToast } from "@/components/ui/use-toast";
import PersonalPostDetail from "@/components/PersonalPostDetail";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CustomerNav from "@/components/CustomerNav";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import PersonalPost from "@/components/PersonalPost";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PostCard from "@/components/PostCard";
import OrderCard from "@/components/OrderCard";
import { set } from "date-fns";

export default function Home() {
  const { user, loading } = useAuth();
  // const user_id = user?._id;
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentPost, setRecentPost] = useState(null);
  const [recentOrder, setRecentOrder] = useState(null);

  console.log("recent order", recentOrder);
  console.log("recent post", recentPost);

  useEffect(() => {
    if (user) {
      fetch("http://localhost:8080/api/posts/user/" + user?._id)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setRecentPost(data[0]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
      fetch("http://localhost:8080/api/orders/recent/customer/" + user?._id)
        .then((res) => res.json())
        .then((data) => {
          console.log("recent order-------------", data);
          setRecentOrder(data);
        });
    }
  }, [user]);

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    console.log("selectedPost", selectedPost);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(
      "http://localhost:8080/api/posts/user/search?searchElement=" + searchQuery
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("wohoooheeheheh", data);
      });
  };

  return (
    <div className="h-screen w-screen">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <CustomerNav />

          <div className=" h-full flex p-8 gap-5">
            <div className=" p-4 pt-0 h-full w-[30rem] ">
              <ScrollArea className="">
                <div className="flex flex-col gap-12">
                  <Link href="/customer/clothing-request-form">
                    <Button className="w-full h-12">+ Post a request</Button>
                  </Link>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-neutral-800 font-semibold">
                      Recent Post
                    </div>
                    {recentPost ? (
                      <PostCard post={recentPost} />
                    ) : (
                      <div className="w-full h-56 flex justify-center items-center text-neutral-300 border border-dashed border-neutral-300 rounded-md">
                        No recent post
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-neutral-800 font-semibold">
                      Recent Order
                    </div>
                    {recentOrder && recentOrder !== null ? (
                      <OrderCard order={recentOrder} />
                    ) : (
                      <div className="w-full h-56 flex justify-center items-center text-neutral-300 border border-dashed border-neutral-300 rounded-md">
                        No recent order
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>{" "}
            {data && data?.length !== 0 ? (
              <div className="flex flex-col w-full">
                <div className="flex justify-between">
                  <div className="pl-6 text-neutral-800 font-semibold">
                    All posts
                  </div>
                  {/* <form
                className="w-full max-w-lg mr-6 lg:max-w-xs"
                onSubmit={(e) => handleSearch(e)}
              >
                <Label for="search" className="sr-only">
                  Search
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <Input
                    type="text"
                    id="search"
                    className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-900 sm:text-sm sm:leading-6"
                    placeholder="Search"
                    // value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form> */}
                </div>

                <ScrollArea className="w-full">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className=" w-full p-6 flex flex-col gap-3 ">
                        {isLoading ? (
                          <div className="flex justify-center items-center">
                            Loading...
                          </div>
                        ) : (
                          data?.map((post) => {
                            return (
                              <div
                                key={post._id}
                                onClick={() => handlePostClick(post)}
                              >
                                <PersonalPost post={post} />
                              </div>
                            );
                          })
                        )}
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-[50rem] h-[35rem] flex flex-row p-0">
                      {selectedPost && (
                        <PersonalPostDetail post={selectedPost} />
                      )}
                    </DialogContent>
                  </Dialog>
                </ScrollArea>
              </div>
            ) : (
              <div className="w-full h-screen flex justify-center items-center flex-col -mt-12">
                <div className="text-neutral-500 text-3xl font-semibold">
                  No posts yet
                </div>
                <div className="text-neutral-400 ">
                  Post your first clothing request using the button above
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
