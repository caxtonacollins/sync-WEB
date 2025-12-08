import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.initializeInterceptors();
  }

  public setAccessToken(token: string) {
    this.token = token;
  }

  public clearAuthTokens() {
    this.token = null;
  }

  private initializeInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.refreshPromise) {
            // If we're already refreshing, wait for that to complete
            try {
              const newToken = await this.refreshPromise;
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return this.instance(originalRequest);
              }
            } catch (e) {
              return Promise.reject(e);
            }
          }

          originalRequest._retry = true;
          this.refreshPromise = this.handleTokenRefresh();

          try {
            const newToken = await this.refreshPromise;
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (e) {
            this.clearAuthTokens();
            // You might want to redirect to login here
            return Promise.reject(e);
          } finally {
            this.refreshPromise = null;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleTokenRefresh(): Promise<string | null> {
    try {
      const response = await axios.post(
        `${baseURL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          validateStatus: (status) => status === 200,
        },
      );

      const { access_token: accessToken } = response.data;
      if (!accessToken) {
        this.clearAuthTokens();
        return null
      };

      this.token = accessToken;

      return accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearAuthTokens();
      throw error;
    }
  }

  // Expose the axios instance methods
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }
}

// Create a singleton instance
export const api = new ApiClient();

// Create a custom hook to use the API client with auth
export const useApi = () => {
  return api;
};
