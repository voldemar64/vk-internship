interface Cat {
  id: string;
  url: string;
  width?: number;
  height?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

class CatsApi {
  private readonly _baseUrl: string;
  private readonly _headers: HeadersInit;
  private readonly _apiKey: string;

  constructor(apiKey: string) {
    this._baseUrl = "https://api.thecatapi.com/v1";
    this._headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    };
    this._apiKey = apiKey;
  }

  private async _handleRes(res: Response): Promise<ApiResponse> {
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    return {
      success: false,
      message: `Ошибка ${res.status}: ${res.statusText}`
    };
  }

  public async getCats(limit: number = 10): Promise<ApiResponse<Cat[]>> {
    try {
      const res = await fetch(`${this._baseUrl}/images/search?limit=${limit}`, {
        method: "GET",
        headers: this._headers
      });
      return this._handleRes(res);
    } catch (err) {
      return {
        success: false,
        message: `Ошибка сети: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }
}

const catsApi = new CatsApi("live_WOCjDN9rfUONlazU8MBTlc28BDFLCmIqXLD4STPot0bE0QolZPdKLlRl7ezR63x7");

export default catsApi;
