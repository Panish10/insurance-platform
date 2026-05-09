import api from "./config";

export const getAllPolicies = () => api.get("/api/v1/policies");
export const getActivePolicies = () => api.get("/api/v1/policies/active");
export const getPolicyById = (id) => api.get(`/api/v1/policies/${id}`);
export const createPolicy = (data) => api.post("/api/v1/policies", data);
export const subscribeToPolicy = (id) =>
  api.post(`/api/v1/policies/${id}/subscribe`);
export const getMyPolicies = () => api.get("/api/v1/policies/my-policies");
