import { jwtDecode } from "jwt-decode";

export const decodeToken = () => {
    const token = localStorage.getItem("token");
  let finalDecodedToken = null;
  try {
    finalDecodedToken = token ? jwtDecode(token) : null;
  } catch (error) {
    finalDecodedToken = null;
  }
  return finalDecodedToken;
};

export const isTokenValid = () => {
  const expiryTime = decodeToken()?.exp;
  if (expiryTime) {
    return 1000 * expiryTime > new Date().getTime();
  } else {
    return false;
  }
};
