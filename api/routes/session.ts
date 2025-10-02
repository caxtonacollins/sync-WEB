import axios from "axios";

export const createSession = async (sessionData: any, token: string) => {
  const response = await axios.post(`${process.env.BACKEND_URL}/session`, sessionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllSessions = async (token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/session`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSessionById = async (sessionId: string, token: string) => {
  const response = await axios.get(`${process.env.BACKEND_URL}/session/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSession = async (sessionId: string, sessionData: any, token: string) => {
  const response = await axios.patch(`${process.env.BACKEND_URL}/session/${sessionId}`, sessionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSession = async (sessionId: string, token: string) => {
  const response = await axios.delete(`${process.env.BACKEND_URL}/session/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
