import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7062", // ajuste conforme seu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Interceptor para tratar erros globais
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

// 🔑 Função de login
export const loginRequest = async (data) => {
  try {
    const response = await apiClient.post("api/auth/login", data);

    // Supondo que a API retorne { token: "...", user: {...} }
    const { token, user } = response.data;

    return { token, user };
  } catch (error) {
    throw error;
  }
};

// 🔑 Logout → remove o token
export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

export default apiClient;
