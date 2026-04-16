export interface User {
  _id: string;
  name: string;
  email: string;
  jobTitle: string;
  accessLevel: "PRESIDENT" | "ADMIN" | "USER";
}

export const STORAGE_KEY = "taskiee_user";

export function getLoggedInUser(): User | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(STORAGE_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setLoggedInUser(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = "/login";
}
