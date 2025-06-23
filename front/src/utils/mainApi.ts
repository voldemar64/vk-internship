interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class MainApi {
  private readonly _baseUrl: string;
  private readonly _headers: HeadersInit;

  constructor(baseUrl: string, headers: HeadersInit) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  private async _handleRes(res: Response): Promise<ApiResponse> {
    if (res.ok) {
      const data = res.status === 204 ? undefined : await res.json();
      return { success: true, data };
    } else {
      let message = `Ошибка: ${res.status}`;
      try {
        const errorData = await res.json();
        message = errorData.message || message;
      } catch {}
      return { success: false, message };
    }
  }

  private _getHeaders(): HeadersInit {
    const jwt = localStorage.getItem("jwt");
    return jwt
      ? { Authorization: `Bearer ${jwt}`, ...this._headers }
      : { ...this._headers };
  }

  public async getUserInfo(): Promise<ApiResponse> {
    try {
      const res = await fetch(`${this._baseUrl}/users/me`, {
        headers: this._getHeaders(),
      });
      return this._handleRes(res);
    } catch (err) {
      console.log(`Не удалось получить информацию о пользователе: ${err}`);
      return {
        success: false,
        message: `Не удалось получить информацию о пользователе: ${err}`,
      };
    }
  }
}

const api = new MainApi("http://localhost:5000", {
  Accept: "application/json",
  "Content-Type": "application/json",
});

export default api;