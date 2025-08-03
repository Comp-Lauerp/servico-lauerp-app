import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7062", // ajuste conforme seu backend
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn("Sessão expirada. Redirecionando para login...");
      // aqui dá pra disparar um logout se quiser
    }

    console.error("Erro na API:", {
      url: error.config?.url,
      method: error.config?.method,
      status,
      message: error.message,
    });

    return Promise.reject(error);
  }
);


export const loginRequest = async (data) => {
  try {
    const response = await apiClient.post("api/auth/login", data);

 
    const { token} = response.data;

    return { token };
  } catch (error) {
    throw error;
  }
};

// 🔑 Logout → remove o token
export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

export default apiClient;
