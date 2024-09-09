import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor;
}

export const Menubar = ({ editor }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-2 absolute z-10 top-0 left-0 w-full p-2 bg-neutral-100 dark:bg-neutral-900">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      ></button>
    </div>
  );
};
