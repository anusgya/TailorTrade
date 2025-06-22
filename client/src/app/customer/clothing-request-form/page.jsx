"use client";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { RadioGroup } from "@headlessui/react";
import React, { useState } from "react";
import { format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Colors from "@/lib/data";

const steps = [
  { id: 1, name: "Description" },
  { id: 2, name: "Detail" },
  { id: 3, name: "Deadline" },
];

const buttonState = ["Continue", "Create Post"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ClothingRequestForm() {
  const { user } = useAuth();
  const user_id = user?._id;
  console.log(user_id);
  const router = useRouter();
  const [biddingDeadline, setbiddingDeadline] = useState("");
  const [requiredByDate, setRequiredByDate] = useState("");
  const [selectedColor, setSelectedColor] = useState(Colors[1]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    user: "",
    title: "",
    description: "",
    category_name: "",
    fabric: "",
    pattern: "",
    color: "red",
    size: "",
    bidding_due_date: "",
    required_by: "",
    image_type: "postImage",
    image: null,
  });

  // const [image, setImage] = useState(null);

  useEffect(() => {
    if (user_id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user: user_id,
      }));
    }
  }, [user_id]);

  const showToast = (message, variant) => {
    toast({
      title: message,
      variant: variant,
    });
  };

  const [formNumber, setFormNumber] = useState(1);

  const handleNext = (e) => {
    e.preventDefault();
    setFormNumber(formNumber + 1);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setFormNumber(formNumber - 1);
  };
  const handleButtonClick = (e) => {
    e.preventDefault();
    if (formNumber < 3) {
      setFormNumber((prev) => prev + 1);
    }
  };

  const handlebiddingDeadline = (value) => {
    setbiddingDeadline(value);
    setFormData({ ...formData, bidding_due_date: value.toDateString() });
    console.log(formData);
  };
  const handleRequiredBy = (value) => {
    setRequiredByDate(value);
    setFormData({ ...formData, required_by: value.toDateString() });
  };

  const handleSelectColor = (e) => {
    console.log(e.target.value);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(formData);

  //   try {
  //     const response = await fetch("http://localhost:8080/api/posts/", {
  //       method: "POST",
  //       // headers: {
  //       //   "Content-Type": "application/json",
  //       // },
  //       body: JSON.stringify(formData),
  //       file: image,
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);
  //       showToast("Post created successfully!");
  //       router.push("/customer/dashboard");
  //     } else {
  //       const error = await response.json();
  //       showToast(
  //         error.message || "An error occurred. Please try again later."
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     showToast("An error occurred. Please try again later.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("user", formData.user);
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("category_name", formData.category_name);
    formDataToSubmit.append("fabric", formData.fabric);
    formDataToSubmit.append("pattern", formData.pattern);
    formDataToSubmit.append("color", formData.color);
    formDataToSubmit.append("size", formData.size);
    formDataToSubmit.append("bidding_due_date", formData.bidding_due_date);
    formDataToSubmit.append("required_by", formData.required_by);
    formDataToSubmit.append("image_type", formData.image_type);
    formDataToSubmit.append("image", formData.image);

    console.log(formDataToSubmit);

    try {
      const response = await fetch("http://localhost:8080/api/posts/", {
        method: "POST",
        body: formDataToSubmit, // Notice there is no 'Content-Type' header set
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        showToast("Post created successfully!", "success");
        router.push("/customer/home");
      } else {
        const error = await response.json();
        showToast(
          error.message || "An error occurred. Please try again later.",
          "destructive"
        );
      }
    } catch (error) {
      console.error(error);
      showToast("An error occurred. Please try again later.", "destructive");
    }
  };

  return (
    <div className="px-4 py-12 w-screen h-screen sm:px-6 lg:px-8 flex items-center flex-col">
      <div className=" text-xl font-medium mt-20 mb-10 ">
        <div className="text-xl">Create your custom clothing request</div>
      </div>
      <div className="flex -ml-64 p-3 gap-40">
        <div className="flex justify-center" aria-label="Progress">
          <ol role="list" className="space-y-6 ">
            {steps.map((step) => (
              <li key={step.name}>
                {step.id < formNumber ? (
                  <a href={step.href} className="group">
                    <span className="flex items-start">
                      <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                        <CheckCircleIcon
                          className="h-full w-full text-teal-900 group-hover:text-teal-900"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                        {step.name}
                      </span>
                    </span>
                  </a>
                ) : step.id === formNumber ? (
                  <a
                    href={step.href}
                    className="flex items-start"
                    aria-current="step"
                  >
                    <span
                      className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <span className="absolute h-4 w-4 rounded-full bg-teal-400" />
                      <span className="relative block h-2 w-2 rounded-full bg-teal-900" />
                    </span>
                    <span className="ml-3 text-sm font-medium text-teal-900">
                      {step.name}
                    </span>
                  </a>
                ) : (
                  <a href={step.href} className="group">
                    <div className="flex items-start">
                      <div
                        className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                        aria-hidden="true"
                      >
                        <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
                      </div>
                      <p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                        {step.name}
                      </p>
                    </div>
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>

        <form
          // onChange={handleChange}
          className="grid space-y-2 min-w-96 gap-5 items-center flex-col"
        >
          {formNumber === 1 && (
            <div className="w-full grid  space-y-2 max-w-sm gap-1.5 items-center flex-col">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Eg: Shirt"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="w-sm">
                <Label htmlFor="category-name">Category</Label>
                <Select
                  id="category-name"
                  className="w-full"
                  value={formData.category_name}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_name: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Outer">Outer</SelectItem>
                      <SelectItem value="Sport">Sport</SelectItem>
                      <SelectItem value="Ethnic">Ethnic</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Eg: I want a shirt having two front pockets..."
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          {formNumber === 2 && (
            <div className="w-full grid  space-y-2 max-w-sm gap-1.5 items-center flex-col">
              <div className="w-96 flex flex-wrap gap-2">
                <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                  <RadioGroup.Label className="block text-sm  leading-6 text-gray-900">
                    Choose a color
                  </RadioGroup.Label>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Colors.map((color) => (
                      <RadioGroup.Option
                        key={color.name}
                        value={color}
                        className={({ active, checked }) =>
                          classNames(
                            color.selectedColor,
                            active && checked ? "ring ring-offset-1" : "",
                            !active && checked ? "ring-2" : "",
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                          )
                        }
                      >
                        <RadioGroup.Label as="span" className="sr-only">
                          {color.name}
                        </RadioGroup.Label>
                        <span
                          aria-hidden="true"
                          className={classNames(
                            color.bgColor,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="fabric">Fabric</Label>
                <Input
                  type="text"
                  id="fabric"
                  placeholder="Eg: Cotton, linen, etc"
                  onChange={(e) =>
                    setFormData({ ...formData, fabric: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="pattern">Pattern</Label>
                <Input
                  type="text"
                  id="pattern"
                  placeholder="Eg: Plaid, Floral, Plain, etc"
                  onChange={(e) =>
                    setFormData({ ...formData, pattern: e.target.value })
                  }
                />
              </div>
              <div className="w-sm">
                <Label htmlFor="size">Size</Label>
                <Select
                  id="size"
                  className="w-full"
                  value={formData.size}
                  onValueChange={(value) =>
                    setFormData({ ...formData, size: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="extra-small">XS</SelectItem>
                      <SelectItem value="small">S</SelectItem>
                      <SelectItem value="large">L</SelectItem>
                      <SelectItem value="extra-large">XL</SelectItem>
                      <SelectItem value="double-extra-large">XXL</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Upload a sample photo</Label>
                <Input
                  type="file"
                  id="image"
                  placeholder="Eg: Shirt"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </div>
            </div>
          )}
          {formNumber === 3 && (
            <div className="grid space-y-2 max-w-  gap-1.5 items-center flex-col ">
              <div>
                <Label htmlFor="bidding-deadline">Bidding's open until</Label>
                <Popover id="bidding-deadline">
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !biddingDeadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {biddingDeadline ? (
                        format(biddingDeadline, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={biddingDeadline}
                      onSelect={(value) => handlebiddingDeadline(value)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="apparel-deadline">Apparel required by</Label>
                <Popover id="apparel-deadline">
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !requiredByDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {requiredByDate ? (
                        format(requiredByDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={requiredByDate}
                      onSelect={(value) => handleRequiredBy(value)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          <div className="flex justify-between gap-1 mt-6 w-full">
            {formNumber > 1 && (
              <Button
                variant="secondary"
                onClick={handlePrevious}
                className="w-full"
              >
                Previous
              </Button>
            )}
            {formNumber < 3 ? (
              <Button className="w-full" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="w-full" onClick={handleSubmit}>
                Create a Post
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
