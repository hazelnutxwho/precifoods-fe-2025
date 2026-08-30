import { useEffect, useState } from "react";

// SSR-safe: document tidak ada di server (Next.js prerender/SSR).
const isBrowser = () => typeof document !== "undefined";

export const getCookies = (name: string) => {
  if (!isBrowser()) return undefined;
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(name));
  return cookie?.split("=")[1];
};

export const setCookie = (name: string, value: string) => {
  if (!isBrowser()) return;
  document.cookie = `${name}=${value}; path=/; secure; samesite=strict`;
};

export const removeCookie = (name: string) => {
  if (!isBrowser()) return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const useCheckUpdateData = () => {
  const [isUpdateData, setIsUpdateData] = useState(false);
  useEffect(() => {
    const updateData = getCookies("updateData");
    if (updateData) {
      setIsUpdateData(true);
    }
  }, []);
  return [isUpdateData, setIsUpdateData];
};

export const getAuthorizationHeader = () => {
  const token = getCookies("token");
  return { Authorization: `Bearer ${token}` };
};

export const removeCookiesLogout = () => {
  removeCookie("token");
  removeCookie("updateData");
};

export const getJWTPayload = (key: string) => {
  const jwt = getCookies("token");
  if (!jwt) return null;
  const payload = jwt.split(".")[1];
  const decodedPayload = atob(payload);
  const parsedPayload = JSON.parse(decodedPayload);
  return parsedPayload[key];
};
