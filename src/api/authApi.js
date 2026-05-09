import api from "./config";

export const register = (data) => api.post("/api/v1/auth/register", data);
export const login = (data) => api.post("/api/v1/auth/login", data);
export const getAllUsers = () => api.get("/api/v1/auth/users");
