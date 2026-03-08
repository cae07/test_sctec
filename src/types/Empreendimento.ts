export enum SegmentoAtuacao {
  TECNOLOGIA = 'Tecnologia',
  COMERCIO = 'Comércio',
  INDUSTRIA = 'Indústria',
  SERVICOS = 'Serviços',
  AGRONEGOCIO = 'Agronegócio',
}

export enum Status {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

export interface Empreendimento {
  id?: string;
  nomeEmpreendimento: string;
  nomeEmpreendedor: string;
  municipioSC: string;
  segmentoAtuacao: SegmentoAtuacao;
  contatoEmail: string;
  status: Status;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
