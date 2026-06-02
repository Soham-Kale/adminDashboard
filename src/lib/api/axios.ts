import axios from "axios";

// When NEXT_PUBLIC_API_URL is set (e.g. http://localhost:8000), all
// service calls go directly to the Python backend.
// When unset, calls go to the same-origin Next.js API routes (mock data).
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data ?? error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
