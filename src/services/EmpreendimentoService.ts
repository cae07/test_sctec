import { EmpreendimentoModel } from '../model/empreendimentoModel';
import type { Empreendimento } from '../types/Empreendimento';
import { gerarId } from '../utils/geradorId';
import validarEmpreendimento, { type ValidationError } from '../utils/validarEmpreendimento';

const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:4000';
const EMPREENDIMENTOS_ENDPOINT = `${JSON_SERVER_URL}/empreendimentos`;

export class EmpreendimentoService {
  /**
   * Valida os dados do empreendimento
   * @throws {Error} Se houver erros de validação
   */
  private static validarDados(
    dados: Omit<Empreendimento, 'id' | 'dataCriacao' | 'dataAtualizacao'>,
  ): void {
    const erros = validarEmpreendimento(dados);
    if (erros.length > 0) {
      throw new Error(
        `Erro na validação dos dados: ${erros.map((e: ValidationError) => e.message).join(', ')}`,
      );
    }
  }

  /**
   * Valida as atualizações do empreendimento
   * @throws {Error} Se não houver dados para atualizar
   */
  private static validarAtualizacoes(
    atualizacoes: Partial<Omit<Empreendimento, 'id' | 'dataCriacao'>>,
  ): void {
    if (!atualizacoes || Object.keys(atualizacoes).length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }
  }

  static async createNew(
    novoEmpreendimento: Omit<Empreendimento, 'id' | 'dataCriacao' | 'dataAtualizacao'>,
  ): Promise<Empreendimento> {
    this.validarDados(novoEmpreendimento);

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

  
  static async getAll(): Promise<Empreendimento[]> {
    return EmpreendimentoModel.dbConexion<Empreendimento[]>(EMPREENDIMENTOS_ENDPOINT, {
      method: 'GET',
    });
  }

  static async getById(id: string): Promise<Empreendimento | undefined> {
    try {
      return await EmpreendimentoModel.dbConexion<Empreendimento>(`${EMPREENDIMENTOS_ENDPOINT}/${id}`, {
        method: 'GET',
      });
    } catch (_erro) {
      return undefined;
    }
  }

  static async update(
    id: string,
    atualizacoes: Partial<Omit<Empreendimento, 'id' | 'dataCriacao'>>,
  ): Promise<Empreendimento> {
    // Validar que há dados para atualizar
    this.validarAtualizacoes(atualizacoes);

    // Verificar se empreendimento existe
    const empreendimento = await this.getById(id);
    if (!empreendimento) {
      throw new Error(`Empreendimento com id ${id} não encontrado`);
    }

    // Atualizar com a data de atualização
    const empreendimentoAtualizado: Empreendimento = {
      ...empreendimento,
      ...atualizacoes,
      dataAtualizacao: new Date(),
    };

    return EmpreendimentoModel.dbConexion<Empreendimento>(`${EMPREENDIMENTOS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(empreendimentoAtualizado),
    });
  }

  static async delete(id: string): Promise<void> {
    await EmpreendimentoModel.dbConexion(`${EMPREENDIMENTOS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }
}
