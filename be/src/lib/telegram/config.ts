import TelegramBot from "node-telegram-bot-api";
import { TELEGRAM_BOT_TOKEN } from "@/env.js";

const telegramToken = TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(telegramToken, { polling: true });

export default bot;
