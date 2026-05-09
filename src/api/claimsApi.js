import api from "./config";

export const submitClaim = (data) => api.post("/api/v1/claims", data);
export const getMyClaims = () => api.get("/api/v1/claims/my-claims");
export const getAllClaims = () => api.get("/api/v1/claims");
export const getClaimById = (id) => api.get(`/api/v1/claims/${id}`);
export const updateClaimStatus = (id, status, notes) =>
  api.put(`/api/v1/claims/${id}/status?status=${status}&notes=${notes}`);
