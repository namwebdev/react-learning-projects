import React from "react";
import { IconType } from "react-icons";
import { FiHome, FiLink, FiPaperclip, FiUsers } from "react-icons/fi";

type RouteItem = {
  selected: boolean;
  Icon: IconType;
  title: string;
};

const routes: RouteItem[] = [
  {
    selected: true,
    title: "Dashboard",
    Icon: FiHome,
  },
  {
    selected: false,
    title: "Team",
    Icon: FiUsers,
  },
  {
    selected: false,
    title: "Invoices",
    Icon: FiPaperclip,
  },
  {
    selected: false,
    title: "Integrations",
    Icon: FiLink,
  },
];

export const RouteSelect = () => {
  return (
    <div className="space-y-1">
      {routes.map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </div>
  );
};

interface Props {
  selected: boolean;
  Icon: IconType;
  title: string;
}

const Route = ({ Icon, selected, title }: Props) => {
  return (
    <button
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
        selected
          ? "bg-white text-stone-950 shadow"
          : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
      }`}
    >
      <Icon className={selected ? "text-violet-500" : ""} />
      <span className={selected ? "text-violet-500" : ""}>{title}</span>
    </button>
  );
};
