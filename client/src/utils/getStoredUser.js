//getStoredUser.js
export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
