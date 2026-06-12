export const environment = {
  production: false,
  // apiUrl: "https://streckbase.nu/api",
  // 127.0.0.1 (not localhost): the FastAPI backend binds IPv4 only, and
  // "localhost" resolves to ::1 first on Windows — ~2s timeout per new connection
  apiUrl: "http://127.0.0.1:8080/api"
};
