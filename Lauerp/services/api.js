import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: "https://localhost:7062",
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

export const setAuthToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const loginRequest = async (data) => {
  try {
    const response = await apiClient.post("api/auth/login", data);
    const { token } = response.data;

    await AsyncStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { token };
  } catch (error) {
    throw error;
  }
};

export const criarUsuario = async (data) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const response = await apiClient.post('Usuario/Novo', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
  delete apiClient.defaults.headers.common['Authorization'];
};

export default apiClient;
