export class EmpreendimentoModel {
  static async dbConexion<T>(
    url: string,
    options?: RequestInit,
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(`HTTP ${response.status}: ${erro}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (erro) {
      console.error(`Erro em requisição para ${url}:`, erro);
      throw erro;
    }
  }
}
