const BASE_URL = "https://yfjqns-8081.csb.app";

async function fetchModel(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text); // ← throw Error thay vì object
  }
  return response.json();
}

export { fetchModel, BASE_URL };
