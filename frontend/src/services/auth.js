export function saveToken(token) {
  localStorage.setItem("pairforge_token", token);
}

export function getToken() {
  return localStorage.getItem("pairforge_token");
}

export function clearToken() {
  localStorage.removeItem("pairforge_token");
}

