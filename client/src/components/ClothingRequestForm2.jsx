"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";

const colors = [
  { name: "Optical White", bgColor: "bg-white", selectedColor: "ring-white" },
  {
    name: "Snow Melange",
    bgColor: "bg-gray-100",
    selectedColor: "ring-gray-100",
  },
  {
    name: "Limestone Grey",
    bgColor: "bg-gray-200",
    selectedColor: "ring-gray-200",
  },
  {
    name: "Faded Grey",
    bgColor: "bg-gray-300",
    selectedColor: "ring-gray-300",
  },
  {
    name: "Cloudy Grey",
    bgColor: "bg-gray-400",
    selectedColor: "ring-gray-400",
  },
  {
    name: "Heather Grey",
    bgColor: "bg-gray-500",
    selectedColor: "ring-gray-500",
  },
  {
    name: "Storm Grey",
    bgColor: "bg-gray-600",
    selectedColor: "ring-gray-600",
  },
  { name: "Lava Grey", bgColor: "bg-gray-700", selectedColor: "ring-gray-700" },
  {
    name: "Faded Black",
    bgColor: "bg-gray-800",
    selectedColor: "ring-gray-800",
  },
  { name: "Deep Black", bgColor: "bg-black", selectedColor: "ring-black" },

  {
    name: "Ivory White",
    bgColor: "bg-amber-50",
    selectedColor: "ring-amber-50",
  }, // No direct match, using amber-50 as close
  {
    name: "Honey Beige",
    bgColor: "bg-amber-200",
    selectedColor: "ring-amber-200",
  },
  {
    name: "Oyster Grey",
    bgColor: "bg-warm-gray-300",
    selectedColor: "ring-warm-gray-300",
  }, // Oyster is typically a light warm gray
  {
    name: "Desert Khaki",
    bgColor: "bg-yellow-300",
    selectedColor: "ring-yellow-300",
  }, // Closest to a light khaki color
  {
    name: "Sahara Camel",
    bgColor: "bg-yellow-400",
    selectedColor: "ring-yellow-400",
  },
  {
    name: "Warm Taupe",
    bgColor: "bg-warm-gray-400",
    selectedColor: "ring-warm-gray-400",
  },
  {
    name: "Cedar Brown",
    bgColor: "bg-orange-700",
    selectedColor: "ring-orange-700",
  }, // Cedar has a reddish-brown hue
  {
    name: "Cinnamon Brown",
    bgColor: "bg-red-600",
    selectedColor: "ring-red-600",
  },
  {
    name: "Coffee Brown",
    bgColor: "bg-warm-gray-900",
    selectedColor: "ring-warm-gray-900",
  }, // Closest to dark brown

  {
    name: "Soft Yellow",
    bgColor: "bg-yellow-100",
    selectedColor: "ring-yellow-100",
  },
  {
    name: "Lemon Yellow",
    bgColor: "bg-yellow-300",
    selectedColor: "ring-yellow-300",
  },
  {
    name: "Burned Yellow",
    bgColor: "bg-amber-400",
    selectedColor: "ring-amber-400",
  }, // Burned yellow is closer to amber
  {
    name: "Sandstone Orange",
    bgColor: "bg-orange-300",
    selectedColor: "ring-orange-300",
  },
  {
    name: "Sunny Orange",
    bgColor: "bg-orange-400",
    selectedColor: "ring-orange-400",
  },
  {
    name: "Burned Orange",
    bgColor: "bg-orange-500",
    selectedColor: "ring-orange-500",
  },
  {
    name: "Ginger Brown",
    bgColor: "bg-orange-600",
    selectedColor: "ring-orange-600",
  },
  {
    name: "Dark Amber",
    bgColor: "bg-amber-800",
    selectedColor: "ring-amber-800",
  },

  {
    name: "Soft Lavender",
    bgColor: "bg-purple-100",
    selectedColor: "ring-purple-100",
  },
  {
    name: "Purple Haze",
    bgColor: "bg-purple-300",
    selectedColor: "ring-purple-300",
  },
  {
    name: "Purple Jade",
    bgColor: "bg-purple-400",
    selectedColor: "ring-purple-400",
  },
  {
    name: "Purely Purple",
    bgColor: "bg-purple-500",
    selectedColor: "ring-purple-500",
  },
  {
    name: "Ultra Violet",
    bgColor: "bg-violet-700",
    selectedColor: "ring-violet-700",
  },

  {
    name: "Polar Blue",
    bgColor: "bg-blue-100",
    selectedColor: "ring-blue-100",
  },
  {
    name: "Powder Blue",
    bgColor: "bg-blue-200",
    selectedColor: "ring-blue-200",
  },
  {
    name: "Steel Blue",
    bgColor: "bg-blue-300",
    selectedColor: "ring-blue-300",
  },
  {
    name: "Seaside Blue",
    bgColor: "bg-blue-400",
    selectedColor: "ring-blue-400",
  },
  {
    name: "Stone Blue",
    bgColor: "bg-blue-500",
    selectedColor: "ring-blue-500",
  },
  { name: "Sky Blue", bgColor: "bg-blue-600", selectedColor: "ring-blue-600" },
  {
    name: "Pacific Blue",
    bgColor: "bg-blue-700",
    selectedColor: "ring-blue-700",
  },
  {
    name: "Royal Blue",
    bgColor: "bg-blue-800",
    selectedColor: "ring-blue-800",
  },
  {
    name: "Neptune Blue",
    bgColor: "bg-blue-900",
    selectedColor: "ring-blue-900",
  },
  {
    name: "Petrol Blue",
    bgColor: "bg-cyan-900",
    selectedColor: "ring-cyan-900",
  }, // No exact match, closest available

  {
    name: "Light Aqua",
    bgColor: "bg-cyan-100",
    selectedColor: "ring-cyan-100",
  },
  { name: "Teal Blue", bgColor: "bg-teal-300", selectedColor: "ring-teal-300" },
  {
    name: "Tropical Sea",
    bgColor: "bg-cyan-300",
    selectedColor: "ring-cyan-300",
  },
  {
    name: "Seafoam Green",
    bgColor: "bg-teal-400",
    selectedColor: "ring-teal-400",
  },
  {
    name: "Pine Green",
    bgColor: "bg-teal-500",
    selectedColor: "ring-teal-500",
  },
  {
    name: "Ocean Green",
    bgColor: "bg-teal-600",
    selectedColor: "ring-teal-600",
  },

  {
    name: "Spring Green",
    bgColor: "bg-green-300",
    selectedColor: "ring-green-300",
  },
  {
    name: "Kelly Green",
    bgColor: "bg-green-400",
    selectedColor: "ring-green-400",
  },
  {
    name: "Emerald Green",
    bgColor: "bg-green-600",
    selectedColor: "ring-green-600",
  },
  {
    name: "Seaweed Green",
    bgColor: "bg-green-800",
    selectedColor: "ring-green-800",
  },
  {
    name: "Dusty Olive",
    bgColor: "bg-olive-600",
    selectedColor: "ring-olive-600",
  }, // Using olive for dusty; no direct match
  {
    name: "Midnight Forest",
    bgColor: "bg-green-900",
    selectedColor: "ring-green-900",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ClothingRequestForm2() {
  const [selectedColor, setSelectedColor] = useState(colors[1]);

  // console.log(selectedColor);
  return (
    <div className="w-full grid  space-y-2 max-w-sm gap-1.5 items-center flex-col">
      <div className="w-96 flex flex-wrap gap-2">
        <RadioGroup value={selectedColor} onChange={setSelectedColor}>
          <RadioGroup.Label className="block text-sm  leading-6 text-gray-900">
            Choose a color
          </RadioGroup.Label>
          <div className="mt-4 flex flex-wrap gap-2">
            {colors.map((color) => (
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
      <div className="w-full">
        <Label htmlFor="clothing-category">Category</Label>
        <Select id="clothing-category" className="w-full">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="koshi">Province 1 - Koshi</SelectItem>
              <SelectItem value="madhesh">Province 2 - Madhesh</SelectItem>
              <SelectItem value="bagmati">Province 3 - Bagmati</SelectItem>
              <SelectItem value="gandaki">Province 4 - Gandaki</SelectItem>
              <SelectItem value="lumbini">Province 5 - Lumbini</SelectItem>
              <SelectItem value="karnali">Province 6 - Karnali</SelectItem>
              <SelectItem value="sudurpashchim">
                Province 7 - Sudurpashchim
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-sm">
        <Label htmlFor="clothing-type">Type</Label>
        <Select id="clothing-type" className="w-full">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="koshi">Province 1 - Koshi</SelectItem>
              <SelectItem value="madhesh">Province 2 - Madhesh</SelectItem>
              <SelectItem value="bagmati">Province 3 - Bagmati</SelectItem>
              <SelectItem value="gandaki">Province 4 - Gandaki</SelectItem>
              <SelectItem value="lumbini">Province 5 - Lumbini</SelectItem>
              <SelectItem value="karnali">Province 6 - Karnali</SelectItem>
              <SelectItem value="sudurpashchim">
                Province 7 - Sudurpashchim
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="clothing-description">Description</Label>
        <Input
          type="clothing-description"
          id="password"
          placeholder="Eg: I want a shirt having two front pockets..."
        />
      </div>

      {/* <Button className="">Continue</Button> */}
    </div>
  );
}
