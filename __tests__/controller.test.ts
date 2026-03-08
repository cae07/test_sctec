import { EmpreendimentoController } from '../src/controllers/EmpreendimentoController';
import { EmpreendimentoService } from '../src/services/EmpreendimentoService';
import { SegmentoAtuacao, Status } from '../src/types/Empreendimento';
import type { Request, Response } from 'express';

jest.mock('../src/services/EmpreendimentoService');

const mockRequest = (body: any = {}): Partial<Request> => ({
  body,
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
    it('should create a new empreendimento successfully', async () => {
      const req = mockRequest({
        nome: 'Novo Empreendimento',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        status: Status.ATIVO,
      }) as Request;
      const res = mockResponse() as Response;

      (EmpreendimentoService.createNew as jest.Mock).mockResolvedValue({
        id: '1',
        nome: 'Novo Empreendimento',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        status: Status.ATIVO,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      });

      await EmpreendimentoController.createNew(req, res);

      expect(EmpreendimentoService.createNew).toHaveBeenCalledWith({
        nome: 'Novo Empreendimento',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        status: Status.ATIVO,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: true,
        mensagem: 'Empreendimento criado com sucesso',
        dados: expect.objectContaining({
          id: '1',
          nome: 'Novo Empreendimento',
          segmento: SegmentoAtuacao.TECNOLOGIA,
          status: Status.ATIVO,
        }),
      });
    });
  });

   describe('obterTodos', () => {
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
  });

  describe('obterPorId', () => {
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

      const req = mockRequest() as any;
      req.params = { id: '123' };
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

      const req = mockRequest() as any;
      req.params = { id: '999' };
      const res = mockResponse() as Response;

      await EmpreendimentoController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: false,
        mensagem: 'Empreendimento não encontrado',
      });
    });
  });
});
