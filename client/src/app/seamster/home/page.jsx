"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import RequestPost from "@/components/RequestPost";
import TailorSideBar from "@/components/TailorSideBar";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import RequestPostDetail from "@/components/RequestPostDetail";
import TailorNav from "@/components/TailorNav";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/posts")
      .then((res) => res.json())
      .then((data) => {
        const filteredData = data?.filter((post) => {
          const remainingBiddingHours =
            new Date() - new Date(post.bidding_due_date);
          return remainingBiddingHours < 0;
        });
        setPosts(filteredData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/posts/search?searchElement=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error searching posts:", error);
      });
  };

  const handleSeachQueryChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="h-screen w-screen">
      <TailorNav />
      <div className="h-full flex p-8 gap-5">
        <div className="p-4 h-full">
          <ScrollArea>
            <TailorSideBar posts={posts} setPosts={setPosts} />
          </ScrollArea>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex justify-between mr-6">
            <div className="flex flex-col pl-6">
              <div className="text-neutral-600 font-semibold">
                Customer requests
              </div>
            </div>
            <form
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
                  value={searchQuery}
                  onChange={(e) => handleSeachQueryChange(e)}
                />
              </div>
            </form>
          </div>

          <ScrollArea className="w-full">
            <Dialog>
              <DialogTrigger asChild>
                <div className="w-full p-6 flex flex-col gap-3">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      Loading...
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div onClick={() => handlePostClick(post)} key={post.id}>
                        <RequestPost post={post} />
                      </div>
                    ))
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[50rem] h-[40rem] flex flex-row p-0">
                {selectedPost && <RequestPostDetail post={selectedPost} />}
              </DialogContent>
            </Dialog>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
