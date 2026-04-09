import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, Pressable, ScrollView, Dimensions } from 'react-native';
import Screen from '../components/Screen';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onLogin: () => void;
  onSkip?: () => void;
}

export default function IntroScreen({ onLogin, onSkip }: Props) {
  const t = useTheme();
  const screenW = Dimensions.get('window').width;

  const heroRef = useRef<ScrollView | null>(null);
  const servicesRef = useRef<ScrollView | null>(null);

  const [heroIndex, setHeroIndex] = useState(0);
  const heroImages = [
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80',
  ];

  const services = [
    { title: 'Troca de óleo', subtitle: 'Óleos sintéticos e semissintéticos', image: 'https://images.unsplash.com/photo-1582719478176-7a0a2f45f3d0?auto=format&fit=crop&w=800&q=60' },
    { title: 'Revisão', subtitle: 'Planos preventivos por km', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=60' },
    { title: 'Alinhamento', subtitle: 'Alinhamento e balanceamento', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=60' },
  ];

  const testimonials = [
    { name: 'Maria F.', text: 'Excelente atendimento e rapidez na entrega do serviço.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60', stars: 5 },
    { name: 'João P.', text: 'Preço justo e mecânicos muito competentes.', avatar: 'https://images.unsplash.com/photo-1545996124-1b2b31a1b1c8?auto=format&fit=crop&w=200&q=60', stars: 4 },
    { name: 'Carla M.', text: 'Sempre confio minha frota a eles — ótimos profissionais.', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=60', stars: 5 },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      const next = (heroIndex + 1) % heroImages.length;
      setHeroIndex(next);
      try {
        heroRef.current?.scrollTo({ x: next * screenW, animated: true });
      } catch (e) {}
    }, 3500);
    return () => clearInterval(id);
  }, [heroIndex]);

  useEffect(() => {
    const id2 = setInterval(() => {
      try {
        const x = Math.floor((Date.now() / 3200) % services.length) * (screenW * 0.72);
        servicesRef.current?.scrollTo({ x, animated: true });
      } catch (e) {}
    }, 3200);
    return () => clearInterval(id2);
  }, []);

  return (
    <Screen>
      {/* HERO CAROUSEL */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={r => (heroRef.current = r)}
        onMomentumScrollEnd={ev => {
          const idx = Math.round(ev.nativeEvent.contentOffset.x / screenW);
          setHeroIndex(idx);
        }}
        style={{ marginBottom: 10 }}
      >
        {heroImages.map((uri, i) => (
          <Image key={i} source={{ uri }} style={[styles.hero, { width: screenW - 40 }]} resizeMode="cover" />
        ))}
      </ScrollView>

      {/* Header row with logo and Entrar */}
      <View style={styles.headerRow}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=160&q=60' }} style={[styles.logo, { borderColor: t.primary }]} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.title, { color: t.text }]}>AUTOGET</Text>
          <Text style={[styles.tagline, { color: t.textSecondary }]}>Gestão inteligente para sua oficina</Text>
        </View>
        <Pressable onPress={onLogin} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, padding: 8 }]}>
          <Text style={{ color: t.primary, fontWeight: '700' }}>Entrar</Text>
        </Pressable>
      </View>

      {/* Services carousel */}
      <Text style={[styles.sectionTitle, { color: t.text }]}>Nossos serviços</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={r => (servicesRef.current = r)}
        contentContainerStyle={{ paddingVertical: 8 }}
      >
        {services.map((s, idx) => (
          <View key={idx} style={styles.serviceCard}>
            <Image source={{ uri: s.image }} style={styles.serviceImage} />
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceLabel, { color: t.text }]}>{s.title}</Text>
              <Text style={[styles.serviceSub, { color: t.textSecondary }]}>{s.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Testimonials */}
      <Text style={[styles.sectionTitle, { color: t.text, marginTop: 6 }]}>Depoimentos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
        {testimonials.map((tst, i) => (
          <View key={i} style={[styles.testimonialCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
            <Image source={{ uri: tst.avatar }} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.reviewText, { color: t.text }]}>{tst.text}</Text>
              <Text style={[styles.reviewAuthor, { color: t.textSecondary }]}>{tst.name} • {'★'.repeat(tst.stars)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Card>
        <Text style={[styles.sectionTitle, { color: t.text }]}>Endereço</Text>
        <Text style={[styles.paragraph, { color: t.textSecondary }]}>R. do Comércio, 123 — Samambaia, Brasília/DF</Text>

        <Text style={[styles.sectionTitle, { color: t.text }]}>Contato</Text>
        <Text style={[styles.paragraph, { color: t.textSecondary }]}>Telefone: (61) 99001-1234</Text>
      </Card>

      <View style={styles.actions}>
        <Button title="Abrir mapa" onPress={() => Linking.openURL('https://www.google.com/maps/search/Samambaia+Bras%C3%ADlia+DF')} fullWidth={true} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logo: { width: 72, height: 72, borderRadius: 12, borderWidth: 2, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '800' },
  tagline: { fontSize: 13, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  paragraph: { fontSize: 14, marginTop: 6, lineHeight: 20 },

  /* Services carousel */
  serviceCard: { width: 0.72 * Dimensions.get('window').width, marginRight: 12, borderRadius: 10, overflow: 'hidden', backgroundColor: '#111' },
  serviceImage: { width: '100%', height: 120 },
  serviceInfo: { padding: 10 },
  serviceLabel: { fontSize: 16, fontWeight: '800' },
  serviceSub: { fontSize: 13, marginTop: 4 },

  /* Testimonials */
  testimonialCard: { width: 260, padding: 12, borderRadius: 10, borderWidth: 1, marginRight: 12, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ddd' },
  reviewText: { fontSize: 14, lineHeight: 18 },
  reviewAuthor: { fontSize: 12, marginTop: 6 },

  actions: { marginTop: 18, gap: 8 },
});
