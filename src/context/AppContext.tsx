import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  Cliente,
  Veiculo,
  OrdemServico,
  Agendamento,
  Peca,
  TransacaoFinanceira,
  ItemOS,
} from '../types';

// ============================================================
// DADOS MOCK - simula um backend local
// ============================================================

const MOCK_CLIENTES: Cliente[] = [
  { id: '1', nome: 'Carlos Oliveira', cpf: '123.456.789-00', telefone: '(61) 99001-1234', email: 'carlos@email.com', endereco: 'Rua A, 100', criadoEm: '2026-01-15' },
  { id: '2', nome: 'Ana Silva', cpf: '987.654.321-00', telefone: '(61) 98765-4321', email: 'ana@email.com', endereco: 'Av. B, 250', criadoEm: '2026-02-03' },
  { id: '3', nome: 'Roberto Santos', cpf: '456.789.123-00', telefone: '(61) 91234-5678', email: 'roberto@email.com', endereco: 'Rua C, 75', criadoEm: '2026-02-20' },
  { id: '4', nome: 'Maria Fernandes', cpf: '321.654.987-00', telefone: '(61) 94567-8901', email: 'maria@email.com', endereco: 'Rua D, 310', criadoEm: '2026-03-01' },
  { id: '5', nome: 'João Pereira', cpf: '789.123.456-00', telefone: '(61) 93456-7890', email: 'joao@email.com', endereco: 'Av. E, 500', criadoEm: '2026-03-10' },
];

const MOCK_VEICULOS: Veiculo[] = [
  { id: '1', clienteId: '1', marca: 'Toyota', modelo: 'Corolla', ano: 2022, placa: 'ABC-1234', cor: 'Prata', quilometragem: 35000, criadoEm: '2026-01-15' },
  { id: '2', clienteId: '1', marca: 'Honda', modelo: 'Civic', ano: 2021, placa: 'DEF-5678', cor: 'Preto', quilometragem: 48000, criadoEm: '2026-01-20' },
  { id: '3', clienteId: '2', marca: 'Volkswagen', modelo: 'Golf', ano: 2023, placa: 'GHI-9012', cor: 'Branco', quilometragem: 12000, criadoEm: '2026-02-03' },
  { id: '4', clienteId: '3', marca: 'Chevrolet', modelo: 'Onix', ano: 2020, placa: 'JKL-3456', cor: 'Vermelho', quilometragem: 62000, criadoEm: '2026-02-20' },
  { id: '5', clienteId: '4', marca: 'Hyundai', modelo: 'HB20', ano: 2024, placa: 'MNO-7890', cor: 'Azul', quilometragem: 5000, criadoEm: '2026-03-01' },
  { id: '6', clienteId: '5', marca: 'Jeep', modelo: 'Compass', ano: 2023, placa: 'PQR-1122', cor: 'Verde', quilometragem: 20000, criadoEm: '2026-03-10' },
];

const MOCK_OS: OrdemServico[] = [
  { id: 'OS-001', clienteId: '1', veiculoId: '1', status: 'em_andamento', descricaoProblema: 'Barulho na suspensão dianteira', itens: [
    { id: 'i1', descricao: 'Troca amortecedor dianteiro', quantidade: 2, valorUnitario: 350, tipo: 'peca' },
    { id: 'i2', descricao: 'Mão de obra suspensão', quantidade: 1, valorUnitario: 300, tipo: 'mao_de_obra' },
  ], valorTotal: 1000, valorPago: 500, dataEntrada: '2026-04-05', mecanicoResponsavel: 'Marcos', observacoes: 'Verificar também bandeja' },
  { id: 'OS-002', clienteId: '2', veiculoId: '3', status: 'aberta', descricaoProblema: 'Troca de óleo e filtros', itens: [
    { id: 'i3', descricao: 'Óleo 5W30 sintético', quantidade: 4, valorUnitario: 45, tipo: 'peca' },
    { id: 'i4', descricao: 'Filtro de óleo', quantidade: 1, valorUnitario: 35, tipo: 'peca' },
    { id: 'i5', descricao: 'Troca de óleo', quantidade: 1, valorUnitario: 80, tipo: 'mao_de_obra' },
  ], valorTotal: 295, valorPago: 0, dataEntrada: '2026-04-06', mecanicoResponsavel: 'Marcos' },
  { id: 'OS-003', clienteId: '3', veiculoId: '4', status: 'concluida', descricaoProblema: 'Freio traseiro desgastado', itens: [
    { id: 'i6', descricao: 'Pastilha de freio traseira', quantidade: 1, valorUnitario: 180, tipo: 'peca' },
    { id: 'i7', descricao: 'Disco de freio traseiro', quantidade: 2, valorUnitario: 150, tipo: 'peca' },
    { id: 'i8', descricao: 'Mão de obra freio', quantidade: 1, valorUnitario: 200, tipo: 'mao_de_obra' },
  ], valorTotal: 680, valorPago: 680, dataEntrada: '2026-04-01', dataSaida: '2026-04-03', mecanicoResponsavel: 'Marcos' },
  { id: 'OS-004', clienteId: '4', veiculoId: '5', status: 'aguardando_peca', descricaoProblema: 'Ar condicionado não gela', itens: [
    { id: 'i9', descricao: 'Gás refrigerante', quantidade: 1, valorUnitario: 120, tipo: 'peca' },
    { id: 'i10', descricao: 'Compressor AC', quantidade: 1, valorUnitario: 800, tipo: 'peca' },
    { id: 'i11', descricao: 'Mão de obra AC', quantidade: 1, valorUnitario: 350, tipo: 'mao_de_obra' },
  ], valorTotal: 1270, valorPago: 0, dataEntrada: '2026-04-04', mecanicoResponsavel: 'Marcos', observacoes: 'Aguardando compressor do fornecedor' },
  { id: 'OS-005', clienteId: '5', veiculoId: '6', status: 'aberta', descricaoProblema: 'Revisão 20.000km', itens: [
    { id: 'i12', descricao: 'Revisão completa', quantidade: 1, valorUnitario: 500, tipo: 'mao_de_obra' },
  ], valorTotal: 500, valorPago: 0, dataEntrada: '2026-04-06', mecanicoResponsavel: 'Marcos' },
];

const MOCK_AGENDAMENTOS: Agendamento[] = [
  { id: 'ag1', clienteId: '1', veiculoId: '1', dataHora: '2026-04-07T09:00:00', descricao: 'Retorno suspensão', status: 'confirmado' },
  { id: 'ag2', clienteId: '2', veiculoId: '3', dataHora: '2026-04-07T14:00:00', descricao: 'Alinhamento e balanceamento', status: 'pendente' },
  { id: 'ag3', clienteId: '3', veiculoId: '4', dataHora: '2026-04-08T10:00:00', descricao: 'Verificar vazamento óleo', status: 'confirmado' },
  { id: 'ag4', clienteId: '4', veiculoId: '5', dataHora: '2026-04-09T08:00:00', descricao: 'Instalar compressor AC', status: 'confirmado' },
];

const MOCK_PECAS: Peca[] = [
  { id: 'p1', nome: 'Pastilha de Freio (par)', codigo: 'PF-001', quantidade: 15, estoqueMinimo: 5, precoCompra: 80, precoVenda: 180, fornecedor: 'AutoPeças São Paulo' },
  { id: 'p2', nome: 'Filtro de Óleo Universal', codigo: 'FO-002', quantidade: 30, estoqueMinimo: 10, precoCompra: 15, precoVenda: 35, fornecedor: 'AutoPeças São Paulo' },
  { id: 'p3', nome: 'Óleo 5W30 Sintético 1L', codigo: 'OL-003', quantidade: 50, estoqueMinimo: 20, precoCompra: 25, precoVenda: 45, fornecedor: 'Distribuidora Shell' },
  { id: 'p4', nome: 'Amortecedor Dianteiro', codigo: 'AM-004', quantidade: 3, estoqueMinimo: 4, precoCompra: 180, precoVenda: 350, fornecedor: 'Monroe Suspensões' },
  { id: 'p5', nome: 'Disco de Freio 280mm', codigo: 'DF-005', quantidade: 8, estoqueMinimo: 4, precoCompra: 80, precoVenda: 150, fornecedor: 'Fremax' },
  { id: 'p6', nome: 'Correia Dentada', codigo: 'CD-006', quantidade: 6, estoqueMinimo: 3, precoCompra: 60, precoVenda: 130, fornecedor: 'Gates' },
  { id: 'p7', nome: 'Bateria 60Ah', codigo: 'BA-007', quantidade: 2, estoqueMinimo: 3, precoCompra: 250, precoVenda: 450, fornecedor: 'Heliar' },
  { id: 'p8', nome: 'Vela de Ignição', codigo: 'VI-008', quantidade: 40, estoqueMinimo: 16, precoCompra: 20, precoVenda: 55, fornecedor: 'NGK' },
];

const MOCK_TRANSACOES: TransacaoFinanceira[] = [
  { id: 't1', osId: 'OS-001', tipo: 'receita', descricao: 'Parcial OS-001 Suspensão', valor: 500, data: '2026-04-05', metodo: 'pix', status: 'pago' },
  { id: 't2', osId: 'OS-003', tipo: 'receita', descricao: 'OS-003 Freio completo', valor: 680, data: '2026-04-03', metodo: 'cartao', status: 'pago' },
  { id: 't3', tipo: 'despesa', descricao: 'Compra de peças - Fornecedor', valor: 1200, data: '2026-04-02', metodo: 'boleto', status: 'pago' },
  { id: 't4', tipo: 'despesa', descricao: 'Aluguel oficina', valor: 3000, data: '2026-04-01', metodo: 'boleto', status: 'pago' },
  { id: 't5', osId: 'OS-003', tipo: 'despesa', descricao: 'Pastilha fornecedor', valor: 80, data: '2026-04-01', metodo: 'pix', status: 'pago' },
];

// ============================================================
// CONTEXT STATE
// ============================================================

interface AppContextType {
  clientes: Cliente[];
  veiculos: Veiculo[];
  ordensServico: OrdemServico[];
  agendamentos: Agendamento[];
  pecas: Peca[];
  transacoes: TransacaoFinanceira[];

  addCliente: (c: Omit<Cliente, 'id' | 'criadoEm'>) => void;
  updateCliente: (c: Cliente) => void;
  deleteCliente: (id: string) => void;

  addVeiculo: (v: Omit<Veiculo, 'id' | 'criadoEm'>) => void;
  updateVeiculo: (v: Veiculo) => void;
  deleteVeiculo: (id: string) => void;

  addOS: (os: Omit<OrdemServico, 'id'>) => void;
  updateOS: (os: OrdemServico) => void;
  addOSItem: (osId: string, item: Omit<ItemOS, 'id'>) => void;

  addAgendamento: (a: Omit<Agendamento, 'id'>) => void;
  updateAgendamento: (a: Agendamento) => void;
  deleteAgendamento: (id: string) => void;

  updatePecaEstoque: (id: string, quantidade: number) => void;
  addPeca: (p: Omit<Peca, 'id'>) => void;
  updatePeca: (p: Peca) => void;

  addTransacao: (t: Omit<TransacaoFinanceira, 'id'>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

type Action =
  | { type: 'ADD_CLIENTE'; payload: Cliente }
  | { type: 'UPDATE_CLIENTE'; payload: Cliente }
  | { type: 'DELETE_CLIENTE'; id: string }
  | { type: 'ADD_VEICULO'; payload: Veiculo }
  | { type: 'UPDATE_VEICULO'; payload: Veiculo }
  | { type: 'DELETE_VEICULO'; id: string }
  | { type: 'ADD_OS'; payload: OrdemServico }
  | { type: 'UPDATE_OS'; payload: OrdemServico }
  | { type: 'ADD_AGENDAMENTO'; payload: Agendamento }
  | { type: 'UPDATE_AGENDAMENTO'; payload: Agendamento }
  | { type: 'DELETE_AGENDAMENTO'; id: string }
  | { type: 'ADD_PECA'; payload: Peca }
  | { type: 'UPDATE_PECA'; payload: Peca }
  | { type: 'UPDATE_ESTOQUE'; id: string; quantidade: number }
  | { type: 'ADD_TRANSACAO'; payload: TransacaoFinanceira };

interface State {
  clientes: Cliente[];
  veiculos: Veiculo[];
  ordensServico: OrdemServico[];
  agendamentos: Agendamento[];
  pecas: Peca[];
  transacoes: TransacaoFinanceira[];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_CLIENTE':
      return { ...state, clientes: [...state.clientes, action.payload] };
    case 'UPDATE_CLIENTE':
      return { ...state, clientes: state.clientes.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CLIENTE':
      return { ...state, clientes: state.clientes.filter(c => c.id !== action.id) };
    case 'ADD_VEICULO':
      return { ...state, veiculos: [...state.veiculos, action.payload] };
    case 'UPDATE_VEICULO':
      return { ...state, veiculos: state.veiculos.map(v => v.id === action.payload.id ? action.payload : v) };
    case 'DELETE_VEICULO':
      return { ...state, veiculos: state.veiculos.filter(v => v.id !== action.id) };
    case 'ADD_OS':
      return { ...state, ordensServico: [...state.ordensServico, action.payload] };
    case 'UPDATE_OS':
      return { ...state, ordensServico: state.ordensServico.map(o => o.id === action.payload.id ? action.payload : o) };
    case 'ADD_AGENDAMENTO':
      return { ...state, agendamentos: [...state.agendamentos, action.payload] };
    case 'UPDATE_AGENDAMENTO':
      return { ...state, agendamentos: state.agendamentos.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_AGENDAMENTO':
      return { ...state, agendamentos: state.agendamentos.filter(a => a.id !== action.id) };
    case 'ADD_PECA':
      return { ...state, pecas: [...state.pecas, action.payload] };
    case 'UPDATE_PECA':
      return { ...state, pecas: state.pecas.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'UPDATE_ESTOQUE':
      return { ...state, pecas: state.pecas.map(p => p.id === action.id ? { ...p, quantidade: action.quantidade } : p) };
    case 'ADD_TRANSACAO':
      return { ...state, transacoes: [...state.transacoes, action.payload] };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    clientes: MOCK_CLIENTES,
    veiculos: MOCK_VEICULOS,
    ordensServico: MOCK_OS,
    agendamentos: MOCK_AGENDAMENTOS,
    pecas: MOCK_PECAS,
    transacoes: MOCK_TRANSACOES,
  });

  const genId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  const addCliente = useCallback((c: Omit<Cliente, 'id' | 'criadoEm'>) => {
    dispatch({ type: 'ADD_CLIENTE', payload: { ...c, id: genId(), criadoEm: new Date().toISOString().split('T')[0] } });
  }, []);

  const updateCliente = useCallback((c: Cliente) => {
    dispatch({ type: 'UPDATE_CLIENTE', payload: c });
  }, []);

  const deleteCliente = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CLIENTE', id });
  }, []);

  const addVeiculo = useCallback((v: Omit<Veiculo, 'id' | 'criadoEm'>) => {
    dispatch({ type: 'ADD_VEICULO', payload: { ...v, id: genId(), criadoEm: new Date().toISOString().split('T')[0] } });
  }, []);

  const updateVeiculo = useCallback((v: Veiculo) => {
    dispatch({ type: 'UPDATE_VEICULO', payload: v });
  }, []);

  const deleteVeiculo = useCallback((id: string) => {
    dispatch({ type: 'DELETE_VEICULO', id });
  }, []);

  const addOS = useCallback((os: Omit<OrdemServico, 'id'>) => {
    const newId = `OS-${String(state.ordensServico.length + 1).padStart(3, '0')}`;
    dispatch({ type: 'ADD_OS', payload: { ...os, id: newId } });
  }, [state.ordensServico.length]);

  const updateOS = useCallback((os: OrdemServico) => {
    dispatch({ type: 'UPDATE_OS', payload: os });
  }, []);

  const addOSItem = useCallback((osId: string, item: Omit<ItemOS, 'id'>) => {
    const updated = state.ordensServico.map(o => {
      if (o.id !== osId) return o;
      const newItem = { ...item, id: genId() };
      const novosItens = [...o.itens, newItem];
      const total = novosItens.reduce((s, i) => s + i.valorUnitario * i.quantidade, 0);
      return { ...o, itens: novosItens, valorTotal: total };
    });
    dispatch({ type: 'UPDATE_OS', payload: updated.find(o => o.id === osId) as OrdemServico });
  }, [state.ordensServico]);

  const addAgendamento = useCallback((a: Omit<Agendamento, 'id'>) => {
    dispatch({ type: 'ADD_AGENDAMENTO', payload: { ...a, id: genId() } });
  }, []);

  const updateAgendamento = useCallback((a: Agendamento) => {
    dispatch({ type: 'UPDATE_AGENDAMENTO', payload: a });
  }, []);

  const deleteAgendamento = useCallback((id: string) => {
    dispatch({ type: 'DELETE_AGENDAMENTO', id });
  }, []);

  const addPeca = useCallback((p: Omit<Peca, 'id'>) => {
    dispatch({ type: 'ADD_PECA', payload: { ...p, id: genId() } });
  }, []);

  const updatePeca = useCallback((p: Peca) => {
    dispatch({ type: 'UPDATE_PECA', payload: p });
  }, []);

  const updatePecaEstoque = useCallback((id: string, quantidade: number) => {
    dispatch({ type: 'UPDATE_ESTOQUE', id, quantidade });
  }, []);

  const addTransacao = useCallback((t: Omit<TransacaoFinanceira, 'id'>) => {
    dispatch({ type: 'ADD_TRANSACAO', payload: { ...t, id: genId() } });
  }, []);

  return (
    <AppContext.Provider value={{
      clientes: state.clientes,
      veiculos: state.veiculos,
      ordensServico: state.ordensServico,
      agendamentos: state.agendamentos,
      pecas: state.pecas,
      transacoes: state.transacoes,
      addCliente, updateCliente, deleteCliente,
      addVeiculo, updateVeiculo, deleteVeiculo,
      addOS, updateOS, addOSItem,
      addAgendamento, updateAgendamento, deleteAgendamento,
      addPeca, updatePeca, updatePecaEstoque,
      addTransacao,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be within AppProvider');
  return ctx;
};
