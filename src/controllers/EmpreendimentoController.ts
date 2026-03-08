import type { Request, Response } from 'express';
import type { Empreendimento } from '../types/Empreendimento';
import { EmpreendimentoService } from '../services/EmpreendimentoService';

export class EmpreendimentoController {
  static async createNew(req: Request, res: Response): Promise<void> {
    try {
      const dados: Omit<Empreendimento, 'id' | 'dataCriacao' | 'dataAtualizacao'> = req.body;

      const novoEmpreendimento = await EmpreendimentoService.createNew(dados);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Empreendimento criado com sucesso',
        dados: novoEmpreendimento,
      });
    } catch (erro) {
      console.error('Erro ao criar empreendimento:', erro);
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor';
      const status = mensagem.includes('validação') ? 400 : 500;
      res.status(status).json({
        sucesso: false,
        mensagem,
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

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const atualizacoes: Partial<Omit<Empreendimento, 'id' | 'dataCriacao'>> = req.body;

      const empreendimentoAtualizado = await EmpreendimentoService.update(
        id,
        atualizacoes,
      );

      res.status(200).json({
        sucesso: true,
        mensagem: 'Empreendimento atualizado com sucesso',
        dados: empreendimentoAtualizado,
      });
    } catch (erro) {
      console.error('Erro ao atualizar empreendimento:', erro);
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor';
      let status = 500;

      if (mensagem.includes('não encontrado')) {
        status = 404;
      } else if (mensagem.includes('Nenhum dado')) {
        status = 400;
      }

      res.status(status).json({
        sucesso: false,
        mensagem,
      });
    }
  }
}
