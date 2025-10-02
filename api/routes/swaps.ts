import axios from "axios";

export const getSwapOrdersByUserId = async (userId: string, token: string) => {
  try {
    const response = await axios.get(`/user/${userId}/swap-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching swap orders:", error);
    throw error;
  }
};
