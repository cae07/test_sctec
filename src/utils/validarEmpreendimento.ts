import type { Empreendimento } from '../types/Empreendimento';
import { SegmentoAtuacao, Status } from '../types/Empreendimento';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Valida se um e-mail está em formato correto
 * @param email - E-mail a validar
 * @returns true se válido, false caso contrário
 */
export const validarEmail = (email: string): boolean => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
};

/**
 * Valida um empreendimento
 * @param dados - Dados do empreendimento a validar
 * @returns Array de erros encontrados (vazio se válido)
 */
const validarEmpreendimento = (
  dados: Omit<Empreendimento, 'id' | 'dataCriacao' | 'dataAtualizacao'>,
): ValidationError[] => {
  const erros: ValidationError[] = [];

  if (!dados.nomeEmpreendimento || dados.nomeEmpreendimento.trim() === '') {
    erros.push({
      field: 'nomeEmpreendimento',
      message: 'Nome do empreendimento é obrigatório',
    });
  }

  if (!dados.nomeEmpreendedor || dados.nomeEmpreendedor.trim() === '') {
    erros.push({
      field: 'nomeEmpreendedor',
      message: 'Nome do empreendedor é obrigatório',
    });
  }

  if (!dados.municipioSC || dados.municipioSC.trim() === '') {
    erros.push({
      field: 'municipioSC',
      message: 'Município é obrigatório',
    });
  }

  if (!dados.segmentoAtuacao || !Object.values(SegmentoAtuacao).includes(dados.segmentoAtuacao)) {
    erros.push({
      field: 'segmentoAtuacao',
      message: `Segmento deve ser um dos seguintes: ${Object.values(SegmentoAtuacao).join(', ')}`,
    });
  }

  if (!dados.contatoEmail || dados.contatoEmail.trim() === '') {
    erros.push({
      field: 'contatoEmail',
      message: 'E-mail de contato é obrigatório',
    });
  } else if (!validarEmail(dados.contatoEmail)) {
    erros.push({
      field: 'contatoEmail',
      message: 'E-mail inválido',
    });
  }

  if (!dados.status || !Object.values(Status).includes(dados.status)) {
    erros.push({
      field: 'status',
      message: `Status deve ser ${Status.ATIVO} ou ${Status.INATIVO}`,
    });
  }

  return erros;
};

export default validarEmpreendimento;
