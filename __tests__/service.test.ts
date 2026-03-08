import { EmpreendimentoService } from '../src/services/EmpreendimentoService';
import { EmpreendimentoModel } from '../src/model/empreendimentoModel';
import { SegmentoAtuacao, Status } from '../src/types/Empreendimento';
import type { Empreendimento } from '../src/types/Empreendimento';

jest.mock('../src/model/empreendimentoModel');
jest.mock('../src/utils/geradorId', () => ({
  gerarId: () => 'mock-id-123',
}));

describe('EmpreendimentoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNew', () => {
    const dadosValidos: Omit<Empreendimento, 'id' | 'dataCriacao' | 'dataAtualizacao'> = {
      nomeEmpreendimento: 'Tech Solutions',
      nomeEmpreendedor: 'João Silva',
      municipioSC: 'Florianópolis',
      segmentoAtuacao: SegmentoAtuacao.TECNOLOGIA,
      contatoEmail: 'joao@example.com',
      status: Status.ATIVO,
    };

    it('deve criar um novo empreendimento com dados válidos', async () => {
      const mockEmpreendimento: Empreendimento = {
        id: 'mock-id-123',
        ...dadosValidos,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      };

      (EmpreendimentoModel.dbConexion as jest.Mock).mockResolvedValue(mockEmpreendimento);

      const resultado = await EmpreendimentoService.createNew(dadosValidos);

      expect(resultado).toEqual(mockEmpreendimento);
      expect(EmpreendimentoModel.dbConexion).toHaveBeenCalled();
    });

    it('deve lançar erro quando nomeEmpreendimento está vazio', async () => {
      const dadosInvalidos = { ...dadosValidos, nomeEmpreendimento: '' };

      await expect(EmpreendimentoService.createNew(dadosInvalidos)).rejects.toThrow(
        'Erro na validação dos dados',
      );
      expect(EmpreendimentoModel.dbConexion).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando nomeEmpreendedor está vazio', async () => {
      const dadosInvalidos = { ...dadosValidos, nomeEmpreendedor: '' };

      await expect(EmpreendimentoService.createNew(dadosInvalidos)).rejects.toThrow(
        'Erro na validação dos dados',
      );
      expect(EmpreendimentoModel.dbConexion).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando municipioSC está vazio', async () => {
      const dadosInvalidos = { ...dadosValidos, municipioSC: '' };

      await expect(EmpreendimentoService.createNew(dadosInvalidos)).rejects.toThrow(
        'Erro na validação dos dados',
      );
      expect(EmpreendimentoModel.dbConexion).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando e-mail está vazio', async () => {
      const dadosInvalidos = { ...dadosValidos, contatoEmail: '' };

      await expect(EmpreendimentoService.createNew(dadosInvalidos)).rejects.toThrow(
        'Erro na validação dos dados',
      );
      expect(EmpreendimentoModel.dbConexion).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando e-mail é inválido', async () => {
      const dadosInvalidos = { ...dadosValidos, contatoEmail: 'email-invalido' };

      await expect(EmpreendimentoService.createNew(dadosInvalidos)).rejects.toThrow(
        'Erro na validação dos dados',
      );
      expect(EmpreendimentoModel.dbConexion).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('deve retornar todos os empreendimentos', async () => {
      const empreendimentos: Empreendimento[] = [
        {
          id: '1',
          nomeEmpreendimento: 'Empresa 1',
          nomeEmpreendedor: 'João',
          municipioSC: 'Florianópolis',
          segmentoAtuacao: SegmentoAtuacao.TECNOLOGIA,
          contatoEmail: 'joao@example.com',
          status: Status.ATIVO,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
        },
        {
          id: '2',
          nomeEmpreendimento: 'Empresa 2',
          nomeEmpreendedor: 'Maria',
          municipioSC: 'Blumenau',
          segmentoAtuacao: SegmentoAtuacao.COMERCIO,
          contatoEmail: 'maria@example.com',
          status: Status.ATIVO,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
        },
      ];

      (EmpreendimentoModel.dbConexion as jest.Mock).mockResolvedValue(empreendimentos);

      const resultado = await EmpreendimentoService.getAll();

      expect(resultado).toEqual(empreendimentos);
      expect(EmpreendimentoModel.dbConexion).toHaveBeenCalledWith(
        expect.stringContaining('/empreendimentos'),
        { method: 'GET' },
      );
    });
  });

  describe('getById', () => {
    it('deve retornar um empreendimento por ID', async () => {
      const empreendimento: Empreendimento = {
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

      (EmpreendimentoModel.dbConexion as jest.Mock).mockResolvedValue(empreendimento);

      const resultado = await EmpreendimentoService.getById('123');

      expect(resultado).toEqual(empreendimento);
    });

    it('deve retornar undefined quando empreendimento não existe', async () => {
      (EmpreendimentoModel.dbConexion as jest.Mock).mockRejectedValue(
        new Error('Not found'),
      );

      const resultado = await EmpreendimentoService.getById('999');

      expect(resultado).toBeUndefined();
    });
  });

  describe('update', () => {
    const empreendimentoExistente: Empreendimento = {
      id: '123',
      nomeEmpreendimento: 'Empresa Original',
      nomeEmpreendedor: 'João',
      municipioSC: 'Florianópolis',
      segmentoAtuacao: SegmentoAtuacao.TECNOLOGIA,
      contatoEmail: 'joao@example.com',
      status: Status.ATIVO,
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01'),
    };

    it('deve atualizar um empreendimento com sucesso', async () => {
      const atualizacoes = { nomeEmpreendimento: 'Empresa Atualizada' };
      const empreendimentoAtualizado = { ...empreendimentoExistente, ...atualizacoes };

      (EmpreendimentoModel.dbConexion as jest.Mock)
        .mockResolvedValueOnce(empreendimentoExistente)
        .mockResolvedValueOnce(empreendimentoAtualizado);

      const resultado = await EmpreendimentoService.update('123', atualizacoes);

      expect(resultado).toEqual(expect.objectContaining(atualizacoes));
    });

    it('deve lançar erro quando nenhum dado é fornecido', async () => {
      await expect(EmpreendimentoService.update('123', {})).rejects.toThrow(
        'Nenhum dado para atualizar',
      );
    });

    it('deve lançar erro quando empreendimento não existe', async () => {
      (EmpreendimentoModel.dbConexion as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(
        EmpreendimentoService.update('999', { status: Status.INATIVO }),
      ).rejects.toThrow('não encontrado');
    });

    it('deve atualizar a data de atualização', async () => {
      const atualizacoes = { status: Status.INATIVO };
      const empreendimentoAtualizado = {
        ...empreendimentoExistente,
        ...atualizacoes,
        dataAtualizacao: expect.any(Date),
      };

      (EmpreendimentoModel.dbConexion as jest.Mock)
        .mockResolvedValueOnce(empreendimentoExistente)
        .mockResolvedValueOnce(empreendimentoAtualizado);

      const resultado = await EmpreendimentoService.update('123', atualizacoes);

      expect(resultado.dataAtualizacao).toEqual(expect.any(Date));
      expect(resultado.dataCriacao).toEqual(empreendimentoExistente.dataCriacao);
    });
  });
});
