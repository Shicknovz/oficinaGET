import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';

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

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: t.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
          {onBack && (
            <Button title="Voltar" onPress={onBack} size="small" />
          )}
        </View>
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: t.bgCard, borderColor: t.primary }]}> 
            <Text style={[styles.logoIcon, { color: t.primary }]}>🔧</Text>
          </View>
          <Text style={[styles.title, { color: t.text }]}>AUTOGET</Text>
          <Text style={[styles.subtitle, { color: t.textSecondary }]}>Crie sua conta</Text>
        </View>
        {Platform.OS === 'web' ? (
          <form style={styles.form as any} onSubmit={(event) => { event.preventDefault(); handleRegister(); }}>
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
            <Button title="Cadastrar" onPress={handleRegister} fullWidth icon="person-add" loading={loading} />
          </form>
        ) : (
          <View style={styles.form}>
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
            <Button title="Cadastrar" onPress={handleRegister} fullWidth icon="person-add" loading={loading} />
          </View>
        )}
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
});
