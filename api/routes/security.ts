import api from "../index";

export const setPin = async (userId: string, pin: string, token: string) => {
  const { data } = await api.patch(
    `/user/${userId}/payment-pin`,
    { pin },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data?.success === true;
};

export const verifyPin = async (userId: string, pin: string, token: string) => {
  const { data } = await api.post(
    `/user/${userId}/payment-pin/verify`,
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
  const { data } = await api.patch(
    `/user/${userId}/payment-pin/change`,
    { oldPin, newPin },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data?.success === true;
};


