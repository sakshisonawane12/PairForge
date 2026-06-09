// No more localStorage — cookie is handled by browser automatically
export function clearToken() {
  // just calls logout endpoint which clears the cookie
  return fetch('http://localhost:8080/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  })
}