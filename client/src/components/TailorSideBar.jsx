// import { Separator } from "@radix-ui/react-dropdown-menu";
"use client";

import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { set } from "date-fns";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const filters = [
  {
    id: "category_name",
    name: "Category",
    options: [
      { value: "Casual", label: "Casual" },
      { value: "Formal", label: "Formal" },
      { value: "Sport", label: "Sport" },
      { value: "Ethnic", label: "Ethnic" },
      { value: "Outer", label: "Outer" },
    ],
  },
  {
    id: "fabric",
    name: "Fabric",
    options: [
      { value: "cotton", label: "Cotton" },
      { value: "polyester", label: "Polyester" },
      { value: "wool", label: "Wool" },
      { value: "silk", label: "Silk" },
      { value: "linen", label: "Linen" },
      { value: "rayon", label: "Rayon" },
    ],
  },
  {
    id: "title",
    name: "Apparel Type",
    options: [
      { value: "shirt", label: "Shirt" },
      { value: "tshirt", label: "T-Shirt" },
      { value: "pants", label: "Pants" },
      { value: "shorts", label: "Shorts" },
      { value: "dress", label: "Dress" },
      { value: "skirt", label: "Skirt" },
    ],
  },
];

export default function TailorSideBar({ posts, setPosts }) {
  // const [filterID, setFilterID] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    category_name: [],
    fabric: [],
    title: [],
  });

  const handleFilterOptionsChange = (e) => {
    if (e.target.id === "category_name") {
      setFilterOptions({
        ...filterOptions,
        category_name: [...filterOptions.category_name, e.target.value],
      });
    } else if (e.target.id === "fabric") {
      setFilterOptions({
        ...filterOptions,
        fabric: [...filterOptions.fabric, e.target.value],
      });
    } else if (e.target.id === "title") {
      setFilterOptions({
        ...filterOptions,
        title: [...filterOptions.title, e.target.value],
      });
    }

    console.log("filterOptions", filterOptions);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/posts/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filterOptions),
    })
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, [filterOptions]);
  return (
    <div className=" w-80">
      <div className=" flex flex-col gap-2">
        <form className="mt-4">
          {filters.map((section) => (
            <Disclosure
              as="div"
              key={section.name}
              className="border-t border-gray-200 pb-4 pt-4"
              defaultOpen={true}
              onChange={(e) => handleFilterOptionsChange(e)}
            >
              {({ open }) => (
                <fieldset>
                  <legend className="w-full px-2">
                    <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                      <span className="text-sm font-medium text-gray-900">
                        {section.name}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        <ChevronDownIcon
                          className={classNames(
                            open ? "-rotate-180" : "rotate-0",
                            "h-5 w-5 transform"
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </legend>
                  <Disclosure.Panel className="px-4 pb-2 pt-4">
                    <div className="space-y-6">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`${section.id}`}
                            name={`${section.id}[]`}
                            defaultValue={option.value}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-neutral-700 focus:ring-neutral-700"
                          />
                          <label
                            htmlFor={`${section.id}-${optionIdx}-mobile`}
                            className="ml-3 text-sm text-gray-500"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </fieldset>
              )}
            </Disclosure>
          ))}
        </form>
      </div>
      <Separator />
    </div>
  );
}
