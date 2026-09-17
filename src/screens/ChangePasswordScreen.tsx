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

export default function ChangePasswordScreen({ onBack }: Props) {
  const t = useTheme();
  const [senhaAtual, setSenhaAtual] = useState('');
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
        label="Senha atual"
        placeholder="Informe sua senha atual"
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
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
      <Button title="Salvar nova senha" onPress={handleSubmit} fullWidth icon="shield-checkmark" loading={loading} />
    </>
  );

  const footer = (
    <>
      <View style={[styles.tipCard, { backgroundColor: t.bgInput, borderColor: t.border }]}> 
        <Ionicons name="lock-closed-outline" size={18} color={t.primary} />
        <Text style={[styles.tipText, { color: t.textSecondary }]}>Mantenha o acesso da oficina protegido e atualize sua senha sempre que precisar reforçar a segurança da conta.</Text>
      </View>
      {success && (
        <View style={[styles.successCard, { backgroundColor: t.successBg, borderColor: t.success }]}> 
          <Text style={[styles.successText, { color: t.success }]}>Senha alterada com sucesso. Sua área da oficina já está protegida com a nova credencial.</Text>
        </View>
      )}
      <Pressable onPress={onBack} style={({ pressed }) => [styles.footerLinkWrap, { opacity: pressed ? 0.72 : 1 }]}> 
        <Text style={[styles.footerLink, { color: t.primary }]}>Voltar para a oficina</Text>
      </Pressable>
    </>
  );

  return (
    <AuthLayout
      eyebrow="Segurança da conta"
      title="Altere sua senha para manter o acesso da oficina seguro e o atendimento sempre protegido."
      subtitle="Atualize sua credencial com praticidade para continuar acompanhando clientes, ordens e movimentações da oficina com tranquilidade."
      cardTitle="Alterar senha"
      cardSubtitle="Informe sua senha atual e defina uma nova combinação para proteger sua conta da oficina."
      onBack={onBack}
      backgroundImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80"
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
