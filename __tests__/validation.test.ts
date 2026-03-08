import validarEmpreendimento, { validarEmail } from '../src/utils/validarEmpreendimento';
import type { SegmentoAtuacao, Status } from '../src/types/Empreendimento';
import { SegmentoAtuacao as SegmentoAtuacaoEnum, Status as StatusEnum } from '../src/types/Empreendimento';

describe('Validação', () => {
  describe('validarEmail', () => {
    it('deve validar um e-mail correto', () => {
      const email = 'teste@example.com';
      expect(validarEmail(email)).toBe(true);
    });

    it('deve rejeitar um e-mail sem @', () => {
      const email = 'testeexample.com';
      expect(validarEmail(email)).toBe(false);
    });

    it('deve rejeitar um e-mail sem domínio', () => {
      const email = 'teste@.com';
      expect(validarEmail(email)).toBe(false);
    });
  });

  describe('validarEmpreendimento', () => {
    const dadosValidos = {
      nomeEmpreendimento: 'Tech Solutions',
      nomeEmpreendedor: 'João Silva',
      municipioSC: 'Florianópolis',
      segmentoAtuacao: SegmentoAtuacaoEnum.TECNOLOGIA,
      contatoEmail: 'joao@example.com',
      status: StatusEnum.ATIVO,
    };

    it('deve validar um empreendimento com dados corretos', () => {
      const erros = validarEmpreendimento(dadosValidos);
      expect(erros).toHaveLength(0);
    });

    it('deve rejeitar empreendimento sem nome', () => {
      const dados = { ...dadosValidos, nomeEmpreendimento: '' };
      const erros = validarEmpreendimento(dados);
      expect(erros).toContainEqual({
        field: 'nomeEmpreendimento',
        message: 'Nome do empreendimento é obrigatório',
      });
    });

    it('deve rejeitar empreendimento sem nome do empreendedor', () => {
      const dados = { ...dadosValidos, nomeEmpreendedor: '' };
      const erros = validarEmpreendimento(dados);
      expect(erros).toContainEqual({
        field: 'nomeEmpreendedor',
        message: 'Nome do empreendedor é obrigatório',
      });
    });

    it('deve rejeitar empreendimento sem município', () => {
      const dados = { ...dadosValidos, municipioSC: '' };
      const erros = validarEmpreendimento(dados);
      expect(erros).toContainEqual({
        field: 'municipioSC',
        message: 'Município é obrigatório',
      });
    });

    it('deve rejeitar empreendimento com segmento inválido', () => {
      const dados = { ...dadosValidos, segmentoAtuacao: 'Segmento Inválido' as any };
      const erros = validarEmpreendimento(dados);
      expect(erros.length).toBeGreaterThan(0);
    });

    it('deve rejeitar empreendimento sem e-mail', () => {
      const dados = { ...dadosValidos, contatoEmail: '' };
      const erros = validarEmpreendimento(dados);
      expect(erros).toContainEqual({
        field: 'contatoEmail',
        message: 'E-mail de contato é obrigatório',
      });
    });

    it('deve rejeitar empreendimento com e-mail inválido', () => {
      const dados = { ...dadosValidos, contatoEmail: 'email-invalido' };
      const erros = validarEmpreendimento(dados);
      expect(erros).toContainEqual({
        field: 'contatoEmail',
        message: 'E-mail inválido',
      });
    });

    it('deve rejeitar empreendimento com status inválido', () => {
      const dados = { ...dadosValidos, status: 'status_invalido' as any };
      const erros = validarEmpreendimento(dados);
      expect(erros.length).toBeGreaterThan(0);
    });
  });
});
