import { EmpreendimentoController } from '../src/controllers/EmpreendimentoController';
import { EmpreendimentoService } from '../src/services/EmpreendimentoService';
import { SegmentoAtuacao, Status } from '../src/types/Empreendimento';
import type { Request, Response } from 'express';

jest.mock('../src/services/EmpreendimentoService');

const mockRequest = (body: any = {}, params: any = {}): Partial<Request> => ({
  body,
  params,
});

const mockResponse = (): Partial<Response> => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('EmpreendimentoController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNew', () => {
    it('deve criar um novo empreendimento com sucesso', async () => {
      const dadosEmpreendimento = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipioSC: 'Florianópolis',
        segmentoAtuacao: SegmentoAtuacao.TECNOLOGIA,
        contatoEmail: 'joao@example.com',
        status: Status.ATIVO,
      };

      const req = mockRequest(dadosEmpreendimento) as Request;
      const res = mockResponse() as Response;

      (EmpreendimentoService.createNew as jest.Mock).mockResolvedValue({
        id: '1',
        ...dadosEmpreendimento,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      });

      await EmpreendimentoController.createNew(req, res);

      expect(EmpreendimentoService.createNew).toHaveBeenCalledWith(dadosEmpreendimento);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: true,
        mensagem: 'Empreendimento criado com sucesso',
        dados: expect.objectContaining({
          id: '1',
          nomeEmpreendimento: 'Tech Solutions',
        }),
      });
    });

    it('deve retornar erro 400 quando validação falha', async () => {
      const dadosInvalidos = {
        nomeEmpreendimento: '',
        nomeEmpreendedor: 'João',
        municipioSC: 'Florianópolis',
        segmentoAtuacao: SegmentoAtuacao.TECNOLOGIA,
        contatoEmail: 'joao@example.com',
        status: Status.ATIVO,
      };

      const req = mockRequest(dadosInvalidos) as Request;
      const res = mockResponse() as Response;

      (EmpreendimentoService.createNew as jest.Mock).mockRejectedValue(
        new Error('Erro na validação dos dados: Nome do empreendimento é obrigatório'),
      );

      await EmpreendimentoController.createNew(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: false,
        mensagem: 'Erro na validação dos dados: Nome do empreendimento é obrigatório',
      });
    });

    it('deve retornar erro 500 em caso de erro do servidor', async () => {
      const dadosEmpreendimento = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipioSC: 'Florianópolis',
        segmentoAtuacao: SegmentoAtuacao.TECNOLOGIA,
        contatoEmail: 'joao@example.com',
        status: Status.ATIVO,
      };

      const req = mockRequest(dadosEmpreendimento) as Request;
      const res = mockResponse() as Response;

      (EmpreendimentoService.createNew as jest.Mock).mockRejectedValue(
        new Error('Erro na conexão com o banco de dados'),
      );

      await EmpreendimentoController.createNew(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: false,
        mensagem: 'Erro na conexão com o banco de dados',
      });
    });
  });

  describe('getAll', () => {
    it('deve retornar todos os empreendimentos', async () => {
      const empreendimentos = [
        {
          id: '123',
          nomeEmpreendimento: 'Empresa 1',
          nomeEmpreendedor: 'João',
          municipioSC: 'Florianópolis',
          segmentoAtuacao: SegmentoAtuacao.TECNOLOGIA,
          contatoEmail: 'joao@example.com',
          status: Status.ATIVO,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
        },
      ];

      (EmpreendimentoService.getAll as jest.Mock).mockResolvedValue(empreendimentos);

      const req = mockRequest() as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: true,
        dados: empreendimentos,
        total: 1,
      });
    });

    it('deve retornar erro 500 ao falhar na obtenção de empreendimentos', async () => {
      (EmpreendimentoService.getAll as jest.Mock).mockRejectedValue(
        new Error('Erro na conexão com o banco de dados'),
      );

      const req = mockRequest() as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
      });
    });
  });

  describe('getById', () => {
    it('deve retornar um empreendimento por ID', async () => {
      const empreendimento = {
        id: '123',
        nomeEmpreendimento: 'Empresa 1',
        nomeEmpreendedor: 'João',
        municipioSC: 'Florianópolis',
        segmentoAtuacao: SegmentoAtuacao.TECNOLOGIA,
        contatoEmail: 'joao@example.com',
        status: Status.ATIVO,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      };

      (EmpreendimentoService.getById as jest.Mock).mockResolvedValue(empreendimento);

      const req = mockRequest({}, { id: '123' }) as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: true,
        dados: empreendimento,
      });
    });

    it('deve retornar erro 404 quando empreendimento não existe', async () => {
      (EmpreendimentoService.getById as jest.Mock).mockResolvedValue(undefined);

      const req = mockRequest({}, { id: '999' }) as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: false,
        mensagem: 'Empreendimento não encontrado',
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um empreendimento com sucesso', async () => {
      const empreendimentoAtualizado = {
        id: '123',
        nomeEmpreendimento: 'Empresa Atualizada',
        nomeEmpreendedor: 'João',
        municipioSC: 'Florianópolis',
        segmentoAtuacao: SegmentoAtuacao.TECNOLOGIA,
        contatoEmail: 'joao@example.com',
        status: Status.ATIVO,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      };

      (EmpreendimentoService.update as jest.Mock).mockResolvedValue(
        empreendimentoAtualizado,
      );

      const req = mockRequest({ nomeEmpreendimento: 'Empresa Atualizada' }, { id: '123' }) as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.update(req, res);

      expect(EmpreendimentoService.update).toHaveBeenCalledWith(
        '123',
        { nomeEmpreendimento: 'Empresa Atualizada' },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: true,
        mensagem: 'Empreendimento atualizado com sucesso',
        dados: empreendimentoAtualizado,
      });
    });

    it('deve retornar erro 400 quando nenhum dado é fornecido', async () => {
      (EmpreendimentoService.update as jest.Mock).mockRejectedValue(
        new Error('Nenhum dado para atualizar'),
      );

      const req = mockRequest({}, { id: '123' }) as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: false,
        mensagem: 'Nenhum dado para atualizar',
      });
    });

    it('deve retornar erro 404 quando empreendimento não é encontrado', async () => {
      (EmpreendimentoService.update as jest.Mock).mockRejectedValue(
        new Error('Empreendimento com id 999 não encontrado'),
      );

      const req = mockRequest({ status: Status.INATIVO }, { id: '999' }) as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: false,
        mensagem: 'Empreendimento com id 999 não encontrado',
      });
    });

    it('deve retornar erro 500 em caso de erro do servidor', async () => {
      (EmpreendimentoService.update as jest.Mock).mockRejectedValue(
        new Error('Erro na conexão com o banco de dados'),
      );

      const req = mockRequest({ status: Status.INATIVO }, { id: '123' }) as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: false,
        mensagem: 'Erro na conexão com o banco de dados',
      });
    });
  });

  describe('delete', () => {
    it('deve deletar um empreendimento com sucesso', async () => {
      (EmpreendimentoService.delete as jest.Mock).mockResolvedValue(undefined);

      const req = mockRequest({}, { id: '123' }) as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.delete(req, res);

      expect(EmpreendimentoService.delete).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar erro 500 quando falha ao deletar', async () => {
      (EmpreendimentoService.delete as jest.Mock).mockRejectedValue(
        new Error('Erro na conexão com o banco de dados'),
      );

      const req = mockRequest({}, { id: '123' }) as Request;
      const res = mockResponse() as Response;

      await EmpreendimentoController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: false,
        mensagem: 'Erro interno do servidor ao deletar empreendimento',
      });
    });
  });
});
