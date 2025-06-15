export async function login(
  request: Request,
  data: { email: string; password: string }
) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: data.email, password: data.password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return await response.json();
}

export async function logout(request: Request): Promise<Response> {
  const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  return await resp.json();
}

export const checkUser = async (request: Request) => {
  const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });

  const user = await resp.json();
  return user?.user;
};