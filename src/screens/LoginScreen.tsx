import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';

interface Props {
  onLogin: () => void;
  onBack?: () => void;
}

export default function LoginScreen({ onLogin, onBack }: Props) {
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

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: t.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
          <Pressable onPress={() => onBack && onBack()} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, padding: 8 }]}>
            <Text style={{ color: t.primary, fontWeight: '700' }}>Voltar</Text>
          </Pressable>
        </View>
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: t.bgCard, borderColor: t.primary }]}>
            <Text style={[styles.logoIcon, { color: t.primary }]}>🔧</Text>
          </View>
          <Text style={[styles.title, { color: t.text }]}>AUTOGET</Text>
          <Text style={[styles.subtitle, { color: t.textSecondary }]}>Gestão Inteligente para sua Oficina</Text>
        </View>

        <View style={styles.form}>
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

          <Button title="Entrar" onPress={handleLogin} fullWidth icon="log-in" loading={loading} />

          <Text style={[styles.demoNote, { color: t.textMuted }]}>
            Toque em "Entrar" para acessar (modo demonstração)
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logoCircle: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginBottom: 16 },
  logoIcon: { fontSize: 42 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, marginTop: 6 },
  form: { marginTop: 8 },
  demoNote: { fontSize: 13, marginTop: 16, textAlign: 'center' },
});
