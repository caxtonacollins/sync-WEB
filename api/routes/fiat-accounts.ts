import axios from "axios";

export const getFiatAccountsByUserId = async (userId: string, token: string) => {
  try {
    const response = await axios.get(`/user/${userId}/fiat-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching fiat accounts:", error);
    throw error;
  }
};
