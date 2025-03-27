import { jwtDecode, JwtPayload } from "jwt-decode";

export const getAuthData = () => {
  const token = localStorage.getItem("authInfo");

  if (token) {
    const decodedToken = jwtDecode<JwtPayload & { data?: any }>(token);
    if (decodedToken.data) {
      return decodedToken.data;
    }
    return null;
  }
  return null;
};

export const saveToStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
