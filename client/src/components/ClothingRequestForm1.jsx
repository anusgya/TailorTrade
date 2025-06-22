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

function ClothingRequestForm1() {
  return (
    <div className="w-full grid  space-y-2 max-w-sm gap-1.5 items-center flex-col">
      <div>
        <Label htmlFor="clothing-title">Title</Label>
        <Input type="text" id="clothing-title" placeholder="Eg: Shirt" />
      </div>
      <div className="w-full">
        <Label htmlFor="clothing-category">Category</Label>
        <Select id="clothing-category" className="w-96">
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

export default ClothingRequestForm1;
