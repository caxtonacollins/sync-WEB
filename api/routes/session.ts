import api from "../index";

export const createSession = async (sessionData: any, token: string) => {
  const response = await api.post(`/session`, sessionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllSessions = async (token: string) => {
  const response = await api.get(`/session`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSessionById = async (sessionId: string, token: string) => {
  const response = await api.get(`/session/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSession = async (sessionId: string, sessionData: any, token: string) => {
  const response = await api.patch(`/session/${sessionId}`, sessionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSession = async (sessionId: string, token: string) => {
  const response = await api.delete(`/session/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
