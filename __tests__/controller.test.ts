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
});
