import { Group } from "@db/models/group.model.js";
import { Subscription } from "@db/models/subscription.model.js";
import bot from "@/lib/telegram/config.js";

export const keyVerify = async () => {
  bot.onText(/\/key (.+)/, async (msg, match) => {
    const userId = msg.from?.id;
    const chatId = msg.chat.id; // User's chat ID
    const key = match?.[1]; // Group ID provided by the user

    const subscription = await Subscription.findOne({ subscription_key: key });

    if (!subscription) {
      bot.sendMessage(
        chatId,
        `May be your key is invalid or a server error occurred. Please try again`
      );
      return;
    }

    if (subscription.status !== "activated") {
      bot.sendMessage(chatId, `You subscription is not activated`);
      return;
    }

    const groupInfo = await Group.findOne({ _id: subscription.of_group });

    if (!groupInfo) {
      bot.sendMessage(chatId, `Server error`);
      return;
    }

    if (userId) {
      await Subscription.updateOne({ telegram_user_id: userId });
    }

    if (key && key === subscription.subscription_key) {
      // Generate Invite Link Here
      const link = (
        await generateInviteLink(Number(groupInfo.group_id), userId as number)
      ).invite_link;

      bot.sendMessage(chatId, `You key is valid. Invite Link: ${link}`);

      return;
    }

    bot.sendMessage(chatId, "Please provide a valid group ID.");
  });
};

const generateInviteLink = async (groupId: number, userId: number) => {
  await bot.unbanChatMember(groupId, userId, { only_if_banned: true });

  const currentTimestamp = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại (Unix timestamp)
  const expireDate = currentTimestamp + 30;
  const link = await bot.createChatInviteLink(groupId, {
    expire_date: expireDate,
    member_limit: 1,
  });

  return link;
};
