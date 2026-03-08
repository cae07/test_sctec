import type { Request, Response } from 'express';
import type { Empreendimento } from '../types/Empreendimento';
import { EmpreendimentoService } from '../services/EmpreendimentoService';
import validarEmpreendimento from '../utils/validarEmpreendimento';

export class EmpreendimentoController {
  static async createNew(req: Request, res: Response): Promise<void> {
    try {
      const dados: Omit<Empreendimento, 'id' | 'dataCriacao' | 'dataAtualizacao'> = req.body;

      const erros = validarEmpreendimento(dados);
      if (erros.length > 0) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Erro na validação dos dados',
          erros,
        });
        return;
      }

      // Criar empreendimento
      const novoEmpreendimento = await EmpreendimentoService.createNew(dados);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Empreendimento criado com sucesso',
        dados: novoEmpreendimento,
      });
    } catch (erro) {
      console.error('Erro ao criar empreendimento:', erro);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor ao criar empreendimento',
      });
    }
  }

  
  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const empreendimentos = await EmpreendimentoService.getAll();

      res.status(200).json({
        sucesso: true,
        dados: empreendimentos,
        total: empreendimentos.length,
      });
    } catch (erro) {
      console.error('Erro ao obter empreendimentos:', erro);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const empreendimento = await EmpreendimentoService.getById(id);

      if (!empreendimento) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Empreendimento não encontrado',
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: empreendimento,
      });
    } catch (erro) {
      console.error('Erro ao obter empreendimento:', erro);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
      });
    }
  }
}
