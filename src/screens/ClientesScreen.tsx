import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import type { Cliente } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';

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

  return (
    <Screen scroll={false}>
      {/* Search + Add */}
      <View style={[styles.topBar, { backgroundColor: t.bgCard, borderColor: t.border }]}>
        <Input
          placeholder="Buscar cliente..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: t.primary }]} onPress={openAdd}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: 16 }}
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

      {/* Modal Add/Edit */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, { backgroundColor: t.bgCard }]}>
            <Text style={[styles.modalTitle, { color: t.text }]}>{editing ? 'Editar Cliente' : 'Novo Cliente'}</Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <Input label="Nome" value={form.nome} onChangeText={v => setForm(f => ({ ...f, nome: v }))} />
              <Input label="CPF" value={form.cpf} onChangeText={v => setForm(f => ({ ...f, cpf: v }))} keyboardType="numeric" />
              <Input label="Telefone" value={form.telefone} onChangeText={v => setForm(f => ({ ...f, telefone: v }))} keyboardType="phone-pad" />
              <Input label="Email" value={form.email} onChangeText={v => setForm(f => ({ ...f, email: v }))} keyboardType="email-address" />
              <Input label="Endereço" value={form.endereco} onChangeText={v => setForm(f => ({ ...f, endereco: v }))} />
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <Button title="Cancelar" variant="outline" onPress={() => setModalOpen(false)} fullWidth style={{ flex: 1 }} />
              <Button title={editing ? 'Salvar' : 'Adicionar'} variant="success" onPress={save} fullWidth style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  searchInput: { flex: 1, marginRight: 10 },
  addBtn: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '700' },
  name: { fontSize: 16, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 48, fontSize: 16 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
});
