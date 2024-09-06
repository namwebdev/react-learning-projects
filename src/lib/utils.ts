import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookie = (name: string) => {
  // Thêm dấu '=' vào sau tên cookie để tránh trùng lặp với các tên cookie khác
  const nameEQ = name + "=";
  // Lấy tất cả các cookie từ document.cookie
  const ca = document.cookie.split(";");
  // Duyệt qua từng cookie
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    // Loại bỏ khoảng trắng ở đầu của cookie
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    // Nếu tìm thấy cookie có tên cần tìm, trả về giá trị của nó
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  // Nếu không tìm thấy cookie, trả về null
  return null;
};

export const setCookie = (name: string, value: any, days = 30) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();

  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const deleteCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
