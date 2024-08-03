import { AnimatePresence, motion } from "framer-motion";
import { useSelectedUser } from "@/store/useSelectedUser";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { usePreferences } from "@/store/usePreferences";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSound from "use-sound";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImageIcon, Loader, SendHorizontal } from "lucide-react";
import { sendMessage } from "@/actions/message.action";
import { Message } from "@/db/dummy";
import { pusherClient } from "@/lib/pusher";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";

export const ChatBottomBar = () => {
  const { selectedUser } = useSelectedUser();
  const [message, setMessage] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { user: currentUser } = useKindeBrowserClient();
  const { soundEnabled } = usePreferences();
  const queryClient = useQueryClient();

  const [playSound1] = useSound("/sounds/keystroke1.mp3");
  const [playSound2] = useSound("/sounds/keystroke2.mp3");
  const [playSound3] = useSound("/sounds/keystroke3.mp3");
  const [playSound4] = useSound("/sounds/keystroke4.mp3");
  const playSoundFunctions = [playSound1, playSound2, playSound3, playSound4];
  const playRandomKeyStrokeSound = () => {
    const randomIndex = Math.floor(Math.random() * playSoundFunctions.length);
    soundEnabled && playSoundFunctions[randomIndex]();
  };

  const { mutate: submitSendMessage, isPending } = useMutation({
    mutationFn: sendMessage,
  });

  useEffect(() => {
    const channelName = `${currentUser?.id}__${selectedUser?.id}`
      .split("__")
      .sort()
      .join("__");
    const channel = pusherClient?.subscribe(channelName);

    const handleNewMessage = (data: { message: Message }) => {
      queryClient.setQueryData(
        ["messages", selectedUser?.id],
        (oldMessages: Message[]) => {
          return [...oldMessages, data.message];
        }
      );
    };

    channel?.bind("newMessage", handleNewMessage);

    // ! Absolutely important, otherwise the event listener will be added multiple times which means you'll see the incoming new message multiple times
    return () => {
      channel?.unbind("newMessage", handleNewMessage);
      pusherClient?.unsubscribe(channelName);
    };
  }, [currentUser?.id, selectedUser?.id, queryClient, soundEnabled]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    submitSendMessage({
      content: message,
      receiverId: selectedUser?.id!,
    });
    setMessage("");

    textAreaRef.current?.focus();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      return;
    }

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setMessage(message + "\n");
    }
  };

  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      {!message.trim() && (
        <CldUploadWidget
          signatureEndpoint={"/api/sign-cloudinary-params"}
          onSuccess={(result, { widget }) => {
            setImgUrl((result.info as CloudinaryUploadWidgetInfo).secure_url);
            setTimeout(() => widget.close(), 1000);
          }}
        >
          {({ open }) => (
            <ImageIcon
              size={20}
              onClick={() => open()}
              className="cursor-pointer text-muted-foreground"
            />
          )}
        </CldUploadWidget>
      )}

      <Dialog open={!!imgUrl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center relative h-96 w-full mx-auto">
            <Image
              src={imgUrl}
              alt="Image Preview"
              fill
              className="object-contain"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                sendMessage({
                  content: imgUrl,
                  messageType: "image",
                  receiverId: selectedUser?.id!,
                });
                setImgUrl("");
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        <motion.div
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
          key={selectedUser?.id}
          className="w-full relative"
        >
          <Textarea
            autoComplete="off"
            placeholder="Aa"
            rows={1}
            className="w-full border rounded-full flex items-center h-9 resize-none overflow-hidden
						bg-background min-h-0"
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setMessage(e.target.value);
              playRandomKeyStrokeSound();
            }}
            ref={textAreaRef}
          />
        </motion.div>

        <Button
          className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
          variant={"ghost"}
          size={"icon"}
          disabled={isPending}
          onClick={handleSendMessage}
        >
          {isPending ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <SendHorizontal size={20} className="text-muted-foreground" />
          )}
        </Button>
      </AnimatePresence>
    </div>
  );
};
