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

export const generateAlias = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9\s-]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-"); 
};


export const checkLogin = (navigate: (path: string) => void) => {
  const authData = localStorage.getItem("authInfo");

  if (!authData) {
    navigate("/auth/login");
    return;
  }
};
