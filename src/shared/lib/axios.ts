import axios from "axios";

const isBrowser = typeof window !== "undefined";
const hostname = isBrowser ? window.location.hostname : process.env.HOST || "";

const isLocal =
    hostname === "localhost" ||
    hostname.startsWith("127.") ||
    hostname.endsWith(".local") ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.");

// Allow override via env; otherwise choose by environment
const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (isLocal ? "http://localhost:8080" : "http://43.200.241.26:8080");

const api = axios.create({
    baseURL,
    // Enable if you need cookies with CORS; harmless otherwise
    withCredentials: true,
});

export default api;
