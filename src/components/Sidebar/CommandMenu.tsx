import React, { Dispatch, SetStateAction, useState } from "react";
import { Command } from "cmdk";
import { FiEye, FiLink, FiLogOut, FiPhone, FiPlus } from "react-icons/fi";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CommandMenu = ({ open, setOpen }: Props) => {
  const [value, setValue] = useState("");

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 bg-stone-950/50"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl border-stone-300 border overflow-hidden w-full max-w-lg mx-auto mt-12"
      >
        <Command.Input
          value={value}
          onValueChange={setValue}
          placeholder="What do you need?"
          className="relative border-b border-stone-300 p-3 text-lg w-full placeholder:text-stone-400 focus:outline-none"
        />

        <Command.List className="p-3">
          {value && (
            <Command.Empty>
              No results found for{" "}
              <span className="text-violet-500 font-semibold">{value}</span>
            </Command.Empty>
          )}

          <Command.Group heading="Team" className="text-sm mb-3 text-stone-400">
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FiPlus />
              Invite Member
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FiEye />
              See Org Chart
            </Command.Item>
          </Command.Group>

          <Command.Group
            heading="Integrations"
            className="text-sm text-stone-400 mb-3"
          >
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FiLink />
              Link Services
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FiPhone />
              Contact Support
            </Command.Item>
          </Command.Group>

          <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-50 hover:bg-red-500 bg-stone-950 rounded items-center gap-2">
            <FiLogOut />
            Sign Out
          </Command.Item>
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
