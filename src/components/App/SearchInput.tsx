"use client"

import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

export const SearchInput = () => {
  const queryString = useSearchParams();

  return (
    <Input
      name="search"
      type="search"
      defaultValue={queryString.get("q") ?? ""}
      placeholder="Search memes..."
      className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
    />
  );
};
