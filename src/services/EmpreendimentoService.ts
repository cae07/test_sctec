import { EmpreendimentoModel } from '../model/empreendimentoModel';
import type { Empreendimento } from '../types/Empreendimento';
import { gerarId } from '../utils/geradorId';

const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:4000';
const EMPREENDIMENTOS_ENDPOINT = `${JSON_SERVER_URL}/empreendimentos`;

export class EmpreendimentoService {

  static async createNew(
    novoEmpreendimento: Omit<Empreendimento, 'id' | 'dataCriacao' | 'dataAtualizacao'>,
  ): Promise<Empreendimento> {
    const empreendimento: Empreendimento = {
      id: gerarId(),
      ...novoEmpreendimento,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    return EmpreendimentoModel.dbConexion<Empreendimento>(EMPREENDIMENTOS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(empreendimento),
    });
  }
}
