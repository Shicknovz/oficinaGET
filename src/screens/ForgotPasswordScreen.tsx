import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';

interface Props {
  onBack: () => void;
}

export default function ForgotPasswordScreen({ onBack }: Props) {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 900);
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
        label="Nova senha"
        placeholder="Defina uma nova senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />
      <Input
        label="Confirmar senha"
        placeholder="Repita a nova senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />
      <Button title="Redefinir acesso" onPress={handleSubmit} fullWidth icon="key" loading={loading} />
    </>
  );

  const footer = (
    <>
      <View style={[styles.infoCard, { backgroundColor: t.bgInput, borderColor: t.border }]}>
        <Ionicons name="shield-checkmark-outline" size={18} color={t.primary} />
        <Text style={[styles.infoText, { color: t.textSecondary }]}>
          Atualize sua senha para continuar acompanhando os serviços e o histórico do seu veículo com segurança.
        </Text>
      </View>
      {success && (
        <View style={[styles.successCard, { backgroundColor: t.successBg, borderColor: t.success }]}>
          <Text style={[styles.successText, { color: t.success }]}>Senha atualizada com sucesso. Agora você já pode voltar e entrar na área da oficina.</Text>
        </View>
      )}
      <Pressable onPress={onBack} style={({ pressed }) => [styles.footerLinkWrap, { opacity: pressed ? 0.72 : 1 }]}> 
        <Text style={[styles.footerLink, { color: t.primary }]}>Voltar para o login</Text>
      </Pressable>
    </>
  );

  return (
    <AuthLayout
      eyebrow="Recuperar acesso"
      title="Redefina sua senha para voltar a acompanhar o atendimento da oficina sem perder o histórico."
      subtitle="Atualize seu acesso de forma rápida e segura para consultar serviços, revisões e novas movimentações do seu veículo."
      cardTitle="Nova senha"
      cardSubtitle="Informe seu e-mail e defina uma nova senha para retomar o acesso à área do cliente."
      onBack={onBack}
      backgroundImage="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80"
      footer={footer}
    >
      {Platform.OS === 'web' ? (
        <form style={styles.form as any} onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
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
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 10,
  },
  successCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  successText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
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
