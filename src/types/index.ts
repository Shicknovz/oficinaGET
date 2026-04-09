// ============================================================
// TIPOS PRINCIPAIS - AUTOGET
// ============================================================

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  criadoEm: string;
}

export interface Veiculo {
  id: string;
  clienteId: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem: number;
  criadoEm: string;
}

export type OSSStatus =
  | 'aberta'
  | 'em_andamento'
  | 'aguardando_peca'
  | 'concluida'
  | 'cancelada';

export interface ItemOS {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  tipo: 'mao_de_obra' | 'peca';
}

export interface OrdemServico {
  id: string;
  clienteId: string;
  veiculoId: string;
  status: OSStatus;
  descricaoProblema: string;
  itens: ItemOS[];
  valorTotal: number;
  valorPago: number;
  dataEntrada: string;
  dataSaida?: string;
  mecanicoResponsavel: string;
  observacoes?: string;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  veiculoId: string;
  dataHora: string;
  descricao: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

export interface Peca {
  id: string;
  nome: string;
  codigo: string;
  quantidade: number;
  estoqueMinimo: number;
  precoCompra: number;
  precoVenda: number;
  fornecedor: string;
}

export interface TransacaoFinanceira {
  id: string;
  osId?: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  data: string;
  metodo: 'dinheiro' | 'pix' | 'cartao' | 'boleto';
  status: 'pago' | 'pendente' | 'atrasado';
}

export interface ResumoDashboard {
  totalClientes: number;
  totalVeiculos: number;
  osAbertas: number;
  osEmAndamento: number;
  osConcluidasMes: number;
  faturamentoMes: number;
  faturamentoMesAnterior: number;
  agendamentosHoje: number;
  pecasEstoqueBaixo: number;
  totalReceita: number;
  totalDespesas: number;
  ticketMedio: number;
}

export interface AppState {
  clientes: Cliente[];
  veiculos: Veiculo[];
  ordensServico: OrdemServico[];
  agendamentos: Agendamento[];
  pecas: Peca[];
  transacoes: TransacaoFinanceira[];
}
