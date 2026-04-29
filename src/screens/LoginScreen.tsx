import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthLayout from '../components/AuthLayout';

interface Props {
  onLogin: () => void;
  onBack?: () => void;
  onRegister?: () => void;
  onForgotPassword?: () => void;
}

export default function LoginScreen({ onLogin, onBack, onRegister, onForgotPassword }: Props) {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  const formContent = (
    <>
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
        placeholder="Sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {!!onForgotPassword && (
        <Pressable onPress={onForgotPassword} style={({ pressed }) => [styles.helperLinkWrap, { opacity: pressed ? 0.72 : 1 }]}>
          <Text style={[styles.helperLink, { color: t.primary }]}>Esqueci minha senha</Text>
        </Pressable>
      )}

      <Button title="Entrar" onPress={handleLogin} fullWidth icon="log-in" loading={loading} />

      <View style={styles.inlineRow}>
        <View style={[styles.inlineDivider, { backgroundColor: t.border }]} />
        <Text style={[styles.inlineText, { color: t.textMuted }]}>ou</Text>
        <View style={[styles.inlineDivider, { backgroundColor: t.border }]} />
      </View>

      <Button
        title="Criar conta"
        onPress={() => onRegister && onRegister()}
        fullWidth
        icon="person-add"
        style={styles.secondaryButton}
        variant="outline"
      />
    </>
  );

  const footer = (
    <>
      <View style={[styles.demoCard, { backgroundColor: t.bgInput, borderColor: t.border }]}> 
        <Ionicons name="information-circle-outline" size={18} color={t.primary} />
        <Text style={[styles.demoText, { color: t.textSecondary }]}>Entre para acompanhar serviços, aprovações e o histórico do seu veículo junto à oficina.</Text>
      </View>
      {!!onBack && (
        <Pressable onPress={onBack} style={({ pressed }) => [styles.footerLinkWrap, { opacity: pressed ? 0.72 : 1 }]}>
          <Text style={[styles.footerLink, { color: t.primary }]}>Voltar </Text>
        </Pressable>
      )}
    </>
  );

  return (
    <AuthLayout
      eyebrow="Área do cliente"
      title="Entre para acompanhar revisões, diagnósticos e serviços do seu veículo com transparência."
      subtitle="Veja o andamento do atendimento, consulte o histórico e fale com a oficina sempre que precisar."
      cardTitle="Acesse sua conta"
      cardSubtitle="Informe seus dados para consultar orçamentos, ordens de serviço e informações do atendimento da oficina."
      onBack={onBack}
      backgroundImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80"
      footer={footer}
    >
      {Platform.OS === 'web' ? (
        <form style={styles.form as any} onSubmit={(event) => { event.preventDefault(); handleLogin(); }}>
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
  helperLinkWrap: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 14,
    paddingVertical: 4,
  },
  helperLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  inlineDivider: {
    flex: 1,
    height: 1,
  },
  inlineText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginHorizontal: 10,
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: 0,
  },
  demoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  demoText: {
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
