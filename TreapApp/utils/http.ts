import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import store from "../store";
import { logout, resetToken } from "../store/session";
import { router } from "expo-router";

//axios.defaults.baseURL = "http://192.168.61.220:8080/rest/"; // Ajuste conforme necessário - Pedro
//axios.defaults.baseURL = "http://192.168.0.3:8080/rest/"; // Rodrigo
axios.defaults.baseURL = "https://treapapp.ew.r.appspot.com/rest/";

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers["Authorization"] = store.getState().session.token;
    return config;
  },
  (error) => {
    console.error("Error at request.use:", error);
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (resp: AxiosResponse) => {
    const token = resp.headers["Authorization"];
    if (token) store.dispatch(resetToken(token));
    return resp;
  },
  (error) => {
    if (error.response) {
      // Erros com respostas HTTP
      /* console.error(
        "\nErro HTTP:\n",
        error,
        "\nresponse:\n",
        error.response,
        "\ndata:\n",
        error.response.data,
        "\nstatus:\n",
        error.response.status,
        "\nstatusText:\n",
        error.response.statusText
      ); */
      if (error.response.status === 418) {
        store.dispatch(logout());
        router.replace("/sign-in");
      }
    } else if (error.request) {
      // Solicitação feita, mas sem resposta
      console.error("Erro de solicitação:", error.request);
    } else {
      // Algo aconteceu na configuração da solicitação que desencadeou um erro
      console.error("Erro na configuração da solicitação:", error.message);
    }
    return Promise.reject(error);
  }
);

// Função para fazer uma requisição GET
async function httpGet<T>(
  url: string,
  params?: object
): Promise<AxiosResponse<T>> {
  try {
    const response = await axios.get(url, { params });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Função para fazer uma requisição POST
async function httpPost<T>(url: string, data: T): Promise<AxiosResponse<T>> {
  try {
    const response = await axios.post(url, data);
    return response;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    console.error("Config:", error.config);
    throw error;
  }
}

// Função para fazer uma requisição PUT
async function httpPut<T>(url: string, data: T): Promise<AxiosResponse<T>> {
  try {
    const response = await axios.put(url, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Função para fazer uma requisição DELETE
async function httpDelete<T>(url: string): Promise<AxiosResponse<T>> {
  try {
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export { httpGet, httpPost, httpPut, httpDelete };
