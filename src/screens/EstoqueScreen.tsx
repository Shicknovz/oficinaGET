import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import type { Peca } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import ActionSearchBar from '../components/ActionSearchBar';
import ModalShell from '../components/ModalShell';
import SectionHero from '../components/SectionHero';
import { formatCurrency } from '../utils/helpers';

export default function EstoqueScreen() {
  const t = useTheme();
  const { pecas, addPeca, updatePeca, updatePecaEstoque } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Peca | null>(null);
  const [form, setForm] = useState({ nome: '', codigo: '', quantidade: '0', estoqueMinimo: '5', precoCompra: '', precoVenda: '', fornecedor: '' });

  const filtered = useMemo(() =>
    pecas.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase())),
    [pecas, search]
  );
  const baixoEstoque = useMemo(() => pecas.filter(p => p.quantidade < p.estoqueMinimo).length, [pecas]);
  const criticas = useMemo(() => pecas.filter(p => p.quantidade === 0).length, [pecas]);

  const openAdd = () => { setEditing(null); setForm({ nome: '', codigo: '', quantidade: '0', estoqueMinimo: '5', precoCompra: '', precoVenda: '', fornecedor: '' }); setModalOpen(true); };
  const openEdit = (p: Peca) => { setEditing(p); setForm({ nome: p.nome, codigo: p.codigo, quantidade: String(p.quantidade), estoqueMinimo: String(p.estoqueMinimo), precoCompra: String(p.precoCompra), precoVenda: String(p.precoVenda), fornecedor: p.fornecedor }); setModalOpen(true); };
  const save = () => {
    if (!form.nome) return;
    const data = { nome: form.nome, codigo: form.codigo, quantidade: Number(form.quantidade), estoqueMinimo: Number(form.estoqueMinimo), precoCompra: Number(form.precoCompra), precoVenda: Number(form.precoVenda), fornecedor: form.fornecedor };
    if (editing) {
      updatePeca({ ...editing, ...data });
    } else {
      addPeca(data as any);
    }
    setModalOpen(false);
  };

  const adjustStock = (p: Peca, delta: number) => {
    const newVal = Math.max(0, p.quantidade + delta);
    updatePecaEstoque(p.id, newVal);
  };

  return (
    <Screen scroll={false}>
      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <SectionHero
              eyebrow="Estoque inteligente"
              title="Controle peças e insumos com uma visão mais clara do que precisa de atenção."
              subtitle="Acompanhe níveis, busque itens rapidamente e mantenha a oficina abastecida com mais previsibilidade."
              image="https://images.unsplash.com/photo-1581093458791-9d15482442f6?auto=format&fit=crop&w=1600&q=80"
              stats={[
                { icon: 'cube-outline', value: String(pecas.length), label: 'Itens cadastrados' },
                { icon: 'alert-circle-outline', value: String(baixoEstoque), label: 'Baixo estoque' },
                { icon: 'warning-outline', value: String(criticas), label: 'Críticos' },
              ]}
            />
            <ActionSearchBar placeholder="Buscar peça..." value={search} onChangeText={setSearch} onActionPress={openAdd} />

            <View style={styles.legendRow}>
              <View style={[styles.legendItem, { backgroundColor: t.successBg }]}>
                <View style={[styles.legendDot, { backgroundColor: t.success }]} />
                <Text style={{ color: t.textSecondary, fontSize: 11 }}>OK</Text>
              </View>
              <View style={[styles.legendItem, { backgroundColor: t.warningBg }]}>
                <View style={[styles.legendDot, { backgroundColor: t.warning }]} />
                <Text style={{ color: t.textSecondary, fontSize: 11 }}>Baixo</Text>
              </View>
              <View style={[styles.legendItem, { backgroundColor: t.dangerBg }]}>
                <View style={[styles.legendDot, { backgroundColor: t.danger }]} />
                <Text style={{ color: t.textSecondary, fontSize: 11 }}>Crítico</Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => {
          const isCritical = item.quantidade === 0;
          const isLow = item.quantidade < item.estoqueMinimo && !isCritical;
          const indicatorColor = isCritical ? t.danger : isLow ? t.warning : t.success;

          return (
            <Card onPress={() => openEdit(item)}>
              <View style={styles.row}>
                <View style={[styles.stockIndicator, { backgroundColor: indicatorColor }]}>
                  <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>{item.quantidade}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: t.text }]}>{item.nome}</Text>
                  <Text style={{ color: t.textSecondary, fontSize: 13 }}>{item.codigo} • {item.fornecedor}</Text>
                </View>
                <View style={styles.priceCol}>
                  <Text style={{ color: t.textMuted, fontSize: 11 }}>Compra</Text>
                  <Text style={{ color: t.textSecondary, fontSize: 12 }}>{formatCurrency(item.precoCompra)}</Text>
                  <Text style={{ color: t.textMuted, fontSize: 11 }}>Venda</Text>
                  <Text style={{ color: t.success, fontSize: 14, fontWeight: '700' }}>{formatCurrency(item.precoVenda)}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
                <TouchableOpacity style={[styles.stockBtn, { backgroundColor: t.bg }]} onPress={() => adjustStock(item, -1)}>
                  <Ionicons name="remove" size={18} color={t.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.stockBtn, { backgroundColor: t.bg }]} onPress={() => adjustStock(item, 1)}>
                  <Ionicons name="add" size={18} color={t.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.stockBtn, { backgroundColor: t.bg, flex: 1 }]} onPress={() => openEdit(item)}>
                  <Text style={{ color: t.primary, fontSize: 12, fontWeight: '500' }}>Editar</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        }}
      />

      <ModalShell
        visible={modalOpen}
        title={editing ? 'Editar peça' : 'Nova peça'}
        subtitle="Mantenha estoque, preços e fornecedor organizados em um cadastro mais claro."
        onClose={() => setModalOpen(false)}
        scrollable={true}
        footer={
          <View style={styles.modalActions}>
            <Button title="Cancelar" variant="outline" onPress={() => setModalOpen(false)} fullWidth style={styles.modalActionButton} />
            <Button title={editing ? 'Salvar' : 'Adicionar'} variant="success" onPress={save} fullWidth style={styles.modalActionButton} />
          </View>
        }
      >
        <Input label="Nome" value={form.nome} onChangeText={v => setForm(f => ({ ...f, nome: v }))} />
        <Input label="Código" value={form.codigo} onChangeText={v => setForm(f => ({ ...f, codigo: v }))} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Input label="Qtd" value={form.quantidade} onChangeText={v => setForm(f => ({ ...f, quantidade: v }))} keyboardType="numeric" containerStyle={{ flex: 1 }} />
          <Input label="Estoque Mín." value={form.estoqueMinimo} onChangeText={v => setForm(f => ({ ...f, estoqueMinimo: v }))} keyboardType="numeric" containerStyle={{ flex: 1 }} />
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Input label="Preço Compra" value={form.precoCompra} onChangeText={v => setForm(f => ({ ...f, precoCompra: v }))} keyboardType="numeric" containerStyle={{ flex: 1 }} />
          <Input label="Preço Venda" value={form.precoVenda} onChangeText={v => setForm(f => ({ ...f, precoVenda: v }))} keyboardType="numeric" containerStyle={{ flex: 1 }} />
        </View>
        <Input label="Fornecedor" value={form.fornecedor} onChangeText={v => setForm(f => ({ ...f, fornecedor: v }))} />
      </ModalShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 136 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stockIndicator: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '600' },
  priceCol: { alignItems: 'center', minWidth: 60 },
  stockBtn: { alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  legendRow: { paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  empty: { textAlign: 'center', marginTop: 48, fontSize: 16 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalActionButton: { flex: 1 },
});
