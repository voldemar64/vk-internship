interface RegisterRequest {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class AuthApi {
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

  public async register({
                          name,
                          surname,
                          phone,
                          email,
                          password,
                        }: RegisterRequest): Promise<ApiResponse> {
    try {
      const res = await fetch(`${this._baseUrl}/user`, {
        method: "POST",
        headers: this._getHeaders(),
        body: JSON.stringify({ name, surname, phone, email, password }),
      });
      return this._handleRes(res);
    } catch (err) {
      console.log(`Не удалось зарегистрироваться: ${err}`);
      return {
        success: false,
        message: `Не удалось зарегистрироваться: ${err}`,
      };
    }
  }

  public async authorize({
                           email,
                           password,
                         }: LoginRequest): Promise<ApiResponse> {
    try {
      const res = await fetch(`${this._baseUrl}/signin`, {
        method: "POST",
        headers: this._getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return this._handleRes(res);
    } catch (err) {
      console.log(`Не удалось авторизоваться: ${err}`);
      return { success: false, message: `Не удалось авторизоваться: ${err}` };
    }
  }
}

const authApi = new AuthApi("http://localhost:5000", {
  Accept: "application/json",
  "Content-Type": "application/json",
});

export default authApi;