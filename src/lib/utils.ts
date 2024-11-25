import { differenceInYears, format, formatDistance } from "date-fns";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function calculateAge(dob: Date) {
  return differenceInYears(new Date(), dob);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatShortDateTime(date: Date) {
  return format(date, "dd MMM yy h:mm:a");
}

export function createChatId(a: string, b: string) {
  return a > b ? `${b}-${a}` : `${a}-${b}`;
}
