"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./auth.action";
import { createChatId, formatShortDateTime } from "@/lib/utils";
import { ActionResult, MessageDto, MessageWithSenderRecipient } from "@/types";
import { messageSchema, MessageSchema } from "@/schemas";
import { pusherServer } from "@/lib/pusher";

export async function createMessage(
  recipientUserId: string,
  data: MessageSchema
): Promise<ActionResult<MessageDto>> {
  try {
    const userId = await getAuthUserId();
    const validated = messageSchema.safeParse(data);
    if (!validated.success)
      return { status: "error", error: validated.error.errors };

    const { text } = validated.data;
    const message = await prisma.message.create({
      data: {
        text,
        recipientId: recipientUserId,
        senderId: userId,
      },
      select: messageSelect,
    });
    const messageDto = mapMessageToMessageDto(message);

    await pusherServer.trigger(createChatId(userId, recipientUserId), 'message:new', messageDto);
    await pusherServer.trigger(`private-${recipientUserId}`, 'message:new', messageDto);

    return { status: "success", data: messageDto };
  } catch (error) {
    console.error("🚀 ~ createMessage ~ error:", error);
    throw error;
  }
}

export async function getMessagesByContainer(
  container?: string | null,
  cursor?: string,
  limit = 2
) {
  try {
    const userId = await getAuthUserId();
    const conditions = {
      [container === "outbox" ? "senderId" : "recipientId"]: userId,
      ...(container === "outbox"
        ? { senderDeleted: false }
        : { recipientDeleted: false }),
    };

    const messages = await prisma.message.findMany({
      where: {
        ...conditions,
        ...(cursor ? { created: { lte: new Date(cursor) } } : {}),
      },
      orderBy: {
        created: "desc",
      },
      select: messageSelect,
      take: limit + 1,
    });
    console.log("🚀 ~ messages:", messages);

    let nextCursor: string | undefined;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.created.toISOString();
    } else {
      nextCursor = undefined;
    }

    const messagesToReturn = messages.map((message) =>
      mapMessageToMessageDto(message)
    );

    return { messages: messagesToReturn, nextCursor };
  } catch (error) {
    console.error("🚀 ~ getMessagesByContainer ~ error:", error);
    throw error;
  }
}
export async function getMessageThread(recipientId: string) {
  try {
    const userId = await getAuthUserId();
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            recipientId,
            senderDeleted: false,
          },
          {
            senderId: recipientId,
            recipientId: userId,
            recipientDeleted: false,
          },
        ],
      },
      orderBy: {
        created: "asc",
      },
      select: messageSelect,
    });

    let readCount = 0;

    if (messages.length > 0) {
      const unreadMessageIds = messages
        .filter(
          (m) =>
            m.dateRead === null &&
            m.recipient?.userId === userId &&
            m.sender?.userId === recipientId
        )
        .map((m) => m.id);
      // await pusherServer.trigger(
      //   createChatId(recipientId, userId),
      //   "messages:read",
      //   unreadMessageIds
      // );
      readCount = unreadMessageIds.length;
    }

    return {
      messages: messages.map((message) => mapMessageToMessageDto(message)),
      readCount,
    };
  } catch (error) {
    console.error("🚀 ~ getMessageThread ~ error:", error);
    throw error;
  }
}

const messageSelect = {
  id: true,
  text: true,
  created: true,
  dateRead: true,
  sender: {
    select: {
      userId: true,
      name: true,
      image: true,
    },
  },
  recipient: {
    select: {
      userId: true,
      name: true,
      image: true,
    },
  },
};

function mapMessageToMessageDto(message: MessageWithSenderRecipient) {
  return {
    id: message.id,
    text: message.text,
    created: formatShortDateTime(message.created),
    dateRead: message.dateRead ? formatShortDateTime(message.dateRead) : null,
    senderId: message.sender?.userId,
    senderName: message.sender?.name,
    senderImage: message.sender?.image,
    recipientId: message.recipient?.userId,
    recipientImage: message.recipient?.image,
    recipientName: message.recipient?.name,
  };
}
