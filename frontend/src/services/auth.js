// No more localStorage — cookie is handled by browser automatically
export function clearToken() {
  // just calls logout endpoint which clears the cookie
  return fetch("https://paircode-q4k4.onrender.com/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
