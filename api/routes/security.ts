import axios from "axios";

export const setPin = async (userId: string, pin: string, token: string) => {
  const { data } = await axios.patch(
    `${process.env.BACKEND_URL}/user/${userId}/payment-pin`,
    { pin },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data?.success === true;
};

export const verifyPin = async (userId: string, pin: string, token: string) => {
  const { data } = await axios.post(
    `${process.env.BACKEND_URL}/user/${userId}/payment-pin/verify`,
    { pin },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data?.success === true ? true : false;
};

export const changePin = async (
  userId: string,
  oldPin: string,
  newPin: string,
  token: string
) => {
  const { data } = await axios.patch(
    `${process.env.BACKEND_URL}/user/${userId}/payment-pin/change`,
    { oldPin, newPin },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data?.success === true;
};


