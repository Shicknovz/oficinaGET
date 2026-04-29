import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onLogin: () => void;
  onRegister?: () => void;
  onSkip?: () => void;
}

export default function IntroScreen({ onLogin, onRegister, onSkip }: Props) {
  const t = useTheme();
  const { width: screenW } = useWindowDimensions();

  const heroRef = useRef<ScrollView | null>(null);

  const [heroIndex, setHeroIndex] = useState(0);
  const whatsappPhone = '5561990011234';
  const whatsappMessage = encodeURIComponent('Olá, vim pelo aplicativo. Gostaria de maiores informações');
  const cardWidth = Math.max(screenW - 40, 280);
  const serviceCardWidth = Math.min(Math.max(screenW * 0.78, 250), 320);
  const compactHero = screenW < 390;
  const compactMetrics = screenW < 430;
  const heroImages = [
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80',
  ];

  const highlights = [
    { label: 'Agendamentos', value: '24h', icon: 'calendar-outline' as const },
    { label: 'Atualizações', value: 'Tempo real', icon: 'pulse-outline' as const },
    { label: 'Atendimento', value: 'Humanizado', icon: 'people-outline' as const },
  ];

  const services = [
    {
      title: 'Troca de óleo',
      subtitle: 'Óleos sintéticos e semissintéticos com checklist rápido.',
      image: 'https://images.unsplash.com/photo-1582719478176-7a0a2f45f3d0?auto=format&fit=crop&w=800&q=60',
      icon: 'water-outline' as const,
      badge: 'Entrega ágil',
    },
    {
      title: 'Revisão preventiva',
      subtitle: 'Planos por quilometragem para evitar imprevistos.',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=60',
      icon: 'build-outline' as const,
      badge: 'Mais segurança',
    },
    {
      title: 'Alinhamento e balanceamento',
      subtitle: 'Dirigibilidade estável e desgaste uniforme dos pneus.',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=60',
      icon: 'car-sport-outline' as const,
      badge: 'Conforto ao dirigir',
    },
  ];

  const testimonials = [
    {
      name: 'Maria F.',
      text: 'Excelente atendimento, atualização do status e entrega super rápida.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60',
      stars: 5,
      role: 'Cliente recorrente',
    },
    {
      name: 'João P.',
      text: 'Preço justo, equipe transparente e serviço feito com cuidado.',
      avatar: 'https://images.unsplash.com/photo-1545996124-1b2b31a1b1c8?auto=format&fit=crop&w=200&q=60',
      stars: 4,
      role: 'Motorista de app',
    },
    {
      name: 'Carla M.',
      text: 'Consigo acompanhar tudo pelo app e falar com a oficina sem complicação.',
      avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=60',
      stars: 5,
      role: 'Gestora de frota',
    },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      const next = (heroIndex + 1) % heroImages.length;
      setHeroIndex(next);
      try {
        heroRef.current?.scrollTo({ x: next * cardWidth, animated: true });
      } catch (e) {}
    }, 3500);
    return () => clearInterval(id);
  }, [cardWidth, heroImages.length, heroIndex]);

  const handleWhatsAppPress = async () => {
    const appUrl = `whatsapp://send?phone=${whatsappPhone}&text=${whatsappMessage}`;
    const webUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

    try {
      const supported = await Linking.canOpenURL(appUrl);
      await Linking.openURL(supported ? appUrl : webUrl);
    } catch {
      await Linking.openURL(webUrl);
    }
  };

  return (
    <>
      <Screen contentStyle={styles.screenContent}>
        <View style={[styles.heroShell, compactHero && styles.heroShellCompact, { borderColor: t.border, backgroundColor: t.bgCard }]}> 
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={r => { heroRef.current = r; }}
            onMomentumScrollEnd={ev => {
              const idx = Math.round(ev.nativeEvent.contentOffset.x / cardWidth);
              setHeroIndex(idx);
            }}
            style={styles.heroScroll}
          >
            {heroImages.map((uri, i) => (
              <View key={i} style={{ width: cardWidth }}>
                <Image source={{ uri }} style={[styles.hero, compactMetrics && styles.heroMetricsCompact, compactHero && styles.heroCompact, { width: cardWidth }]} resizeMode="cover" />
              </View>
            ))}
          </ScrollView>

          <View style={[styles.heroOverlay, compactHero && styles.heroOverlayCompact]}>
            <View style={[styles.headerRow, compactHero && styles.headerRowCompact]}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=160&q=60' }} style={[styles.logo, compactHero && styles.logoCompact, { borderColor: t.primary }]} />
              <View style={styles.headerTextWrap}>
                <Text style={[styles.title, compactHero && styles.titleCompact, { color: '#FFFFFF' }]}>AUTOGET</Text>
                <Text style={[styles.tagline, compactHero && styles.taglineCompact, { color: 'rgba(255,255,255,0.82)' }]}>Gestão inteligente para sua oficina</Text>
              </View>
              <Pressable onPress={onLogin} style={({ pressed }) => [styles.loginLink, { opacity: pressed ? 0.72 : 1 }]}>
                <Text style={[styles.loginText, { color: '#FFFFFF' }]}>Entrar</Text>
              </Pressable>
            </View>

            <Text style={[styles.heroTitle, compactHero && styles.heroTitleCompact]}>Sua oficina de confiança para cuidar do carro com agilidade e qualidade.</Text>
            <Text style={[styles.heroText, compactHero && styles.heroTextCompact]}>Revisão, manutenção e atendimento transparente para você seguir com mais segurança e tranquilidade.</Text>

            <View style={[styles.metricsRow, compactHero && styles.metricsRowCompact]}>
              {highlights.map((item) => (
                <View
                  key={item.label}
                  style={[
                    styles.metricCard,
                    compactMetrics ? styles.metricCardMobile : styles.metricCardWide,
                    { backgroundColor: 'rgba(10,15,30,0.72)', borderColor: 'rgba(255,255,255,0.12)' },
                  ]}
                >
                  <View style={[styles.metricIconWrap, compactMetrics && styles.metricIconWrapMobile]}>
                    <Ionicons name={item.icon} size={compactMetrics ? 18 : 18} color="#FFFFFF" />
                  </View>
                  <View style={styles.metricTextWrap}>
                    <Text style={[styles.metricValue, compactMetrics && styles.metricValueCompact]}>{item.value}</Text>
                    <Text style={[styles.metricLabel, compactMetrics && styles.metricLabelCompact]}>{item.label}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.heroDotsRow, compactHero && styles.heroDotsRowCompact]}>
              {heroImages.map((_, i) => (
                <View key={i} style={[styles.heroDot, i === heroIndex && { width: 24, backgroundColor: '#FFFFFF' }]} />
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.ctaCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
          <View style={styles.ctaContent}>
            <Text style={[styles.ctaTitle, { color: t.text }]}>Novo por aqui?</Text>
            <Text style={[styles.ctaText, { color: t.textSecondary }]}>Crie seu cadastro para acompanhar atendimentos e falar com a oficina.</Text>
          </View>
          <Button title="Cadastrar-se" onPress={() => onRegister && onRegister()} variant="outline" fullWidth={true} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Nossos serviços</Text>
          <Text style={[styles.sectionSubtitle, { color: t.textSecondary }]}>Soluções frequentes que ajudam o cliente a decidir mais rápido.</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.serviceList}
        >
          {services.map((s, idx) => (
            <View key={idx} style={[styles.serviceCard, { width: serviceCardWidth, backgroundColor: t.bgCard, borderColor: t.border }]}>
              <Image source={{ uri: s.image }} style={styles.serviceImage} />
              <View style={styles.serviceGradient} />
              <View style={[styles.serviceBadge, { backgroundColor: t.infoBg }]}>
                <Text style={[styles.serviceBadgeText, { color: t.info }]}>{s.badge}</Text>
              </View>
              <View style={styles.serviceInfo}>
                <View style={[styles.serviceIconWrap, { backgroundColor: t.bgInput, borderColor: t.border }]}> 
                  <Ionicons name={s.icon} size={18} color={t.primary} />
                </View>
                <Text style={[styles.serviceLabel, { color: t.text }]}>{s.title}</Text>
                <Text style={[styles.serviceSub, { color: t.textSecondary }]}>{s.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: t.text, marginTop: 6 }]}>Depoimentos</Text>
          <Text style={[styles.sectionSubtitle, { color: t.textSecondary }]}>Provas de confiança para reduzir insegurança já no primeiro acesso.</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.testimonialList}>
          {testimonials.map((tst, i) => (
            <View key={i} style={[styles.testimonialCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
              <View style={styles.testimonialHeader}>
                <Image source={{ uri: tst.avatar }} style={styles.avatar} />
                <View style={styles.testimonialIdentity}>
                  <Text style={[styles.reviewAuthorName, { color: t.text }]}>{tst.name}</Text>
                  <Text style={[styles.reviewRole, { color: t.textSecondary }]}>{tst.role}</Text>
                </View>
                <View style={[styles.ratingPill, { backgroundColor: t.warningBg }]}> 
                  <Text style={[styles.ratingText, { color: t.warning }]}>{'★'.repeat(tst.stars)}</Text>
                </View>
              </View>
              <View style={styles.quoteWrap}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={t.primary} />
                <Text style={[styles.reviewText, { color: t.text }]}>{tst.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Card style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: t.text, marginTop: 0 }]}>Visite ou fale conosco</Text>
              <Text style={[styles.locationSubtitle, { color: t.textSecondary }]}>Informações rápidas para transformar interesse em contato.</Text>
            </View>
            <View style={[styles.locationIconWrap, { backgroundColor: t.bgInput, borderColor: t.border }]}> 
              <Ionicons name="location-outline" size={20} color={t.primary} />
            </View>
          </View>

          <View style={styles.locationInfoGrid}>
            <View style={[styles.locationInfoItem, { backgroundColor: t.bgInput, borderColor: t.border }]}>
              <Text style={[styles.locationInfoLabel, { color: t.textSecondary }]}>Endereço</Text>
              <Text style={[styles.locationInfoValue, { color: t.text }]}>R. do Comércio, 123 — Samambaia, Brasília/DF</Text>
            </View>
            <View style={[styles.locationInfoItem, { backgroundColor: t.bgInput, borderColor: t.border }]}>
              <Text style={[styles.locationInfoLabel, { color: t.textSecondary }]}>Contato</Text>
              <Text style={[styles.locationInfoValue, { color: t.text }]}>Telefone: (61) 99001-1234</Text>
            </View>
          </View>

          <Text style={[styles.paragraph, { color: t.textSecondary }]}>Atendimento com acompanhamento digital, transparência no orçamento e comunicação facilitada pelo WhatsApp.</Text>
        </Card>

        <View style={styles.actions}>
          <Button title="Abrir mapa" onPress={() => Linking.openURL('https://www.google.com/maps/search/Samambaia+Bras%C3%ADlia+DF')} fullWidth={true} />
        </View>
      </Screen>

      <Pressable
        onPress={handleWhatsAppPress}
        style={[styles.whatsappFab, { backgroundColor: '#25D366' }]}
        accessibilityRole="button"
        accessibilityLabel="Falar no WhatsApp"
      >
        <Ionicons name="logo-whatsapp" size={30} color="#FFFFFF" />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingBottom: 110 },
  heroShell: {
    borderWidth: 1,
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 18,
  },
  heroShellCompact: {
    marginBottom: 14,
  },
  heroScroll: {
    backgroundColor: '#0A0F1E',
  },
  hero: { height: 460 },
  heroMetricsCompact: { height: 438 },
  heroCompact: { height: 410 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 18,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(5, 10, 22, 0.38)',
  },
  heroOverlayCompact: {
    padding: 16,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  headerRowCompact: { marginTop: 0 },
  headerTextWrap: { flex: 1, marginLeft: 12, marginRight: 8 },
  logo: { width: 72, height: 72, borderRadius: 18, borderWidth: 2, backgroundColor: '#fff' },
  logoCompact: { width: 64, height: 64, borderRadius: 16 },
  title: { fontSize: 26, fontWeight: '800' },
  titleCompact: { fontSize: 22 },
  tagline: { fontSize: 13, marginTop: 4 },
  taglineCompact: { fontSize: 12, marginTop: 2 },
  loginLink: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  loginText: { fontWeight: '800', fontSize: 14 },
  heroTitle: {
    fontSize: 31,
    lineHeight: 38,
    color: '#FFFFFF',
    fontWeight: '900',
    marginTop: 18,
  },
  heroTitleCompact: {
    fontSize: 25,
    lineHeight: 31,
    marginTop: 14,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 23,
    color: 'rgba(255,255,255,0.84)',
    marginTop: 10,
    marginBottom: 18,
    maxWidth: 520,
  },
  heroTextCompact: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  metricsRowCompact: {
    marginBottom: 14,
  },
  metricCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  metricCardWide: {
    width: '31.5%',
  },
  metricCardMobile: {
    width: '100%',
    minHeight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  metricIconWrap: {
    alignItems: 'flex-start',
  },
  metricIconWrapMobile: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metricTextWrap: {
    flex: 1,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
    lineHeight: 19,
  },
  metricValueCompact: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 0,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  metricLabelCompact: {
    fontSize: 12,
    lineHeight: 15,
    marginTop: 2,
  },
  heroDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  heroDotsRowCompact: {
    marginTop: 14,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginRight: 8,
  },
  ctaCard: { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 16 },
  ctaContent: { marginBottom: 14 },
  ctaTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  ctaText: { fontSize: 14, lineHeight: 22 },
  sectionHeader: { marginTop: 4, marginBottom: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginTop: 8 },
  sectionSubtitle: { fontSize: 13, lineHeight: 20, marginTop: 4 },
  paragraph: { fontSize: 14, marginTop: 6, lineHeight: 20 },

  serviceList: { paddingVertical: 10, paddingRight: 4 },
  serviceCard: {
    marginRight: 14,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  serviceImage: { width: '100%', height: 148 },
  serviceGradient: {
    ...StyleSheet.absoluteFillObject,
    height: 148,
    backgroundColor: 'rgba(6, 12, 22, 0.16)',
  },
  serviceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  serviceBadgeText: { fontSize: 12, fontWeight: '800' },
  serviceInfo: { padding: 14 },
  serviceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceLabel: { fontSize: 17, fontWeight: '800' },
  serviceSub: { fontSize: 13, marginTop: 6, lineHeight: 20 },

  testimonialList: { paddingVertical: 10, paddingRight: 4 },
  testimonialCard: { width: 286, padding: 14, borderRadius: 18, borderWidth: 1, marginRight: 12 },
  testimonialHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ddd' },
  testimonialIdentity: { flex: 1, marginLeft: 10, marginRight: 8 },
  reviewAuthorName: { fontSize: 15, fontWeight: '800' },
  reviewRole: { fontSize: 12, marginTop: 3 },
  ratingPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  ratingText: { fontSize: 11, fontWeight: '800' },
  quoteWrap: { flexDirection: 'row', alignItems: 'flex-start' },
  reviewText: { flex: 1, fontSize: 14, lineHeight: 21, marginLeft: 8 },

  locationCard: { marginTop: 8 },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  locationSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
    maxWidth: 260,
  },
  locationIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  locationInfoGrid: {
    marginBottom: 8,
  },
  locationInfoItem: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  locationInfoLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  locationInfoValue: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },

  actions: { marginTop: 18 },
  whatsappFab: {
    position: 'absolute',
    right: 22,
    bottom: 26,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
});
