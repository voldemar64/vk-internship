interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class PostsApi {
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

  public async getInitialPosts(): Promise<ApiResponse> {
    try {
      const res = await fetch(`${this._baseUrl}/items`, {
        method: "GET",
        headers: this._getHeaders(),
      });
      return this._handleRes(res);
    } catch (err) {
      console.log(`Не удалось получить начальные посты: ${err}`);
      return {
        success: false,
        message: `Не удалось получить начальные посты: ${err}`,
      };
    }
  }

  public async getSavedPosts(userId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`${this._baseUrl}/items/saved?userId=${userId}`, {
        method: "GET",
        headers: this._getHeaders(),
      });
      return this._handleRes(res);
    } catch (err) {
      console.log(`Не удалось получить сохраненные посты: ${err}`);
      return {
        success: false,
        message: `Не удалось получить сохраненные посты: ${err}`,
      };
    }
  }

  public async likePost(post_id: string, userId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`${this._baseUrl}/items/${post_id}/likes`, {
        method: "PUT",
        headers: this._getHeaders(),
        body: JSON.stringify({ userId }),
      });
      return this._handleRes(res);
    } catch (err) {
      console.log(`Не удалось поставить лайк на пост: ${err}`);
      return {
        success: false,
        message: `Не удалось поставить лайк на пост: ${err}`,
      };
    }
  }

  public async dislikePost(
    post_id: string,
    userId: string,
  ): Promise<ApiResponse> {
    try {
      const res = await fetch(`${this._baseUrl}/items/${post_id}/likes`, {
        method: "DELETE",
        headers: this._getHeaders(),
        body: JSON.stringify({ userId }),
      });
      return this._handleRes(res);
    } catch (err) {
      console.log(`Не удалось снять лайк с поста: ${err}`);
      return {
        success: false,
        message: `Не удалось снять лайк с поста: ${err}`,
      };
    }
  }
}

const postsApi = new PostsApi("http://localhost:8080", {
  Accept: "application/json",
  "Content-Type": "application/json",
});

export default postsApi;