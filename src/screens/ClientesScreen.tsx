import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import type { Cliente } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import ActionSearchBar from '../components/ActionSearchBar';
import ModalShell from '../components/ModalShell';
import SectionHero from '../components/SectionHero';

export default function ClientesScreen() {
  const t = useTheme();
  const { clientes, veiculos, addCliente, updateCliente, deleteCliente } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '', email: '', endereco: '' });

  const filtered = useMemo(() =>
    clientes.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpf.includes(search)),
    [clientes, search]
  );

  const openAdd = () => { setEditing(null); setForm({ nome: '', cpf: '', telefone: '', email: '', endereco: '' }); setModalOpen(true); };
  const openEdit = (c: Cliente) => { setEditing(c); setForm({ nome: c.nome, cpf: c.cpf, telefone: c.telefone, email: c.email, endereco: c.endereco }); setModalOpen(true); };
  const save = () => { if (!form.nome) return; if (editing) { updateCliente({ ...editing, ...form }); } else { addCliente(form); } setModalOpen(false); };

  const getVeiculoCount = (clienteId: string) => veiculos.filter(v => v.clienteId === clienteId).length;
  const totalVeiculos = useMemo(() => veiculos.length, [veiculos]);

  return (
    <Screen scroll={false} contentStyle={styles.screenContent}>
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <SectionHero
              eyebrow="Relacionamento"
              title="Organize a base de clientes da oficina e fortaleça a confiança em cada atendimento."
              subtitle="Localize contatos, acompanhe veículos vinculados e mantenha o relacionamento da oficina sempre bem estruturado."
              image="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80"
              stats={[
                { icon: 'people-outline', value: String(clientes.length), label: 'Clientes' },
                { icon: 'search-outline', value: String(filtered.length), label: 'Resultados' },
                { icon: 'car-sport-outline', value: String(totalVeiculos), label: 'Veículos vinculados' },
              ]}
            />
            <ActionSearchBar placeholder="Buscar cliente por nome ou CPF..." value={search} onChangeText={setSearch} onActionPress={openAdd} />
          </>
        }
        renderItem={({ item }) => (
          <Card onPress={() => openEdit(item)}>
            <View style={styles.row}>
              <View style={[styles.avatar, { backgroundColor: t.bg }]}>
                <Text style={[styles.avatarText, { color: t.primary }]}>{item.nome.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: t.text }]}>{item.nome}</Text>
                <Text style={{ color: t.textSecondary, fontSize: 13 }}>{item.telefone} • {item.cpf}</Text>
                <Text style={{ color: t.primary, fontSize: 12, fontWeight: '500' }}>
                  {getVeiculoCount(item.id)} veículo{getVeiculoCount(item.id) !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => deleteCliente(item.id)} style={{ padding: 8 }}>
                <Ionicons name="trash-outline" size={20} color={t.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: t.textMuted }]}>Nenhum cliente encontrado</Text>}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: t.primary }]} onPress={openAdd}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <ModalShell
        visible={modalOpen}
        title={editing ? 'Atualizar cliente' : 'Cadastrar cliente'}
        subtitle="Mantenha os dados do cliente organizados para agilizar o atendimento da oficina."
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
        <Input label="CPF" value={form.cpf} onChangeText={v => setForm(f => ({ ...f, cpf: v }))} keyboardType="numeric" />
        <Input label="Telefone" value={form.telefone} onChangeText={v => setForm(f => ({ ...f, telefone: v }))} keyboardType="phone-pad" />
        <Input label="Email" value={form.email} onChangeText={v => setForm(f => ({ ...f, email: v }))} keyboardType="email-address" />
        <Input label="Endereço" value={form.endereco} onChangeText={v => setForm(f => ({ ...f, endereco: v }))} />
      </ModalShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContent: { flex: 1, minHeight: 0 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 136 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 82,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 18px 28px rgba(6, 13, 28, 0.32)' }
      : { elevation: 10, shadowColor: '#000', shadowOpacity: 0.32, shadowRadius: 12 }),
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '700' },
  name: { fontSize: 16, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 48, fontSize: 16 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalActionButton: { flex: 1 },
});
