"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PlaceHolder from "@tiptap/extension-placeholder";
import { Channel } from "@/types";
import { useState } from "react";

interface Props {
  channel: Channel;
}

export const TextEditor = ({ channel }: Props) => {
  const [content, setContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      PlaceHolder.configure({
        placeholder: `Message #${channel?.name ?? "USERNAME"}`,
      }),
    ],
    autofocus: true,
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className="p-1 border dark:border-zinc-500 border-neutral-700 rounded-md relative overflow-hidden">
      <div className="sticky top-0 z-10"></div>
    </div>
  );
};
