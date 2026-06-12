export function getAnonymousUserId(): string {
  if (typeof window === "undefined") return ""; // Prevent SSR errors

  const STORAGE_KEY = "youthcallers_user_id";
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    // Generate a secure random ID
    userId = "anon_" + crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}
