import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthLayout from '../components/AuthLayout';

interface Props {
  onRegister: () => void;
  onBack?: () => void;
}

export default function RegisterScreen({ onRegister, onBack }: Props) {
  const t = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegister();
    }, 1000);
  };

  const formContent = (
    <>
      <Input
        label="Nome"
        placeholder="Seu nome completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <Input
        label="E-mail"
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Input
        label="Senha"
        placeholder="Crie uma senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Button title="Criar cadastro" onPress={handleRegister} fullWidth icon="person-add" loading={loading} />
    </>
  );

  const footer = (
    <>
      <View style={[styles.tipCard, { backgroundColor: t.bgInput, borderColor: t.border }]}> 
        <Ionicons name="sparkles-outline" size={18} color={t.primary} />
        <Text style={[styles.tipText, { color: t.textSecondary }]}>Seu cadastro ajuda a oficina a oferecer um atendimento mais rápido, personalizado e organizado.</Text>
      </View>
      {!!onBack && (
        <Pressable onPress={onBack} style={({ pressed }) => [styles.footerLinkWrap, { opacity: pressed ? 0.72 : 1 }]}>
          <Text style={[styles.footerLink, { color: t.primary }]}>Já tem conta? Voltar para o login</Text>
        </Pressable>
      )}
    </>
  );

  return (
    <AuthLayout
      eyebrow="Novo cadastro"
      title="Cadastre-se para acompanhar revisões, serviços e o histórico do seu veículo com facilidade."
      subtitle="Seu acesso deixa a comunicação com a oficina mais simples, organizada e transparente desde o primeiro atendimento."
      cardTitle="Crie seu acesso"
      cardSubtitle="Preencha seus dados para consultar serviços, receber atualizações e manter seu veículo sempre acompanhado."
      onBack={onBack}
      backgroundImage="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
      footer={footer}
    >
      {Platform.OS === 'web' ? (
        <form style={styles.form as any} onSubmit={(event) => { event.preventDefault(); handleRegister(); }}>
          {formContent}
        </form>
      ) : (
        <View style={styles.form}>{formContent}</View>
      )}
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 4 },
  tipCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 10,
  },
  footerLinkWrap: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 6,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
