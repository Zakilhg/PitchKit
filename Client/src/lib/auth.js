import { apiUrl, requestJson } from "./api";
import { clearSession, setSession } from "./session";

const remember = ({ data }) => {
  setSession({ token: data.token, user: data.user });
  return data.user;
};

export const login = ({ email, password }) =>
  requestJson(apiUrl("auth/login"), { json: { email, password } }).then(remember);

export const register = ({ firstName, lastName, email, password }) =>
  requestJson(apiUrl("auth/register"), {
    json: {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password_confirmation: password,
    },
  }).then(remember);

/** Revoke the token on the server, but sign out locally even if that fails. */
export const logout = async () => {
  try {
    await requestJson(apiUrl("auth/logout"), { method: "POST" });
  } finally {
    clearSession();
  }
};

export const displayName = (user) =>
  [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username || "";
