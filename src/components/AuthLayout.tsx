import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface HighlightItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

interface Props {
  eyebrow: string;
  title: string;
  subtitle: string;
  cardTitle: string;
  cardSubtitle: string;
  onBack?: () => void;
  backgroundImage: string;
  highlights?: HighlightItem[];
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  cardTitle,
  cardSubtitle,
  onBack,
  backgroundImage,
  highlights,
  children,
  footer,
}: Props) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width >= 960;
  const isTablet = width >= 700;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: t.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={{ uri: backgroundImage }} style={styles.background} imageStyle={styles.backgroundImage}>
        <View style={styles.backdrop} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.shell, isWide && styles.shellWide]}>
            <View style={[styles.heroPanel, isWide && styles.heroPanelWide]}>
              {onBack && (
                <Pressable
                  onPress={onBack}
                  style={({ pressed }) => [
                    styles.backButton,
                    { borderColor: `${t.border}AA`, backgroundColor: 'rgba(10,15,30,0.34)', opacity: pressed ? 0.76 : 1 },
                  ]}
                >
                  <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
                  <Text style={styles.backButtonText}>Voltar</Text>
                </Pressable>
              )}

              <View style={styles.brandRow}>
                <View style={[styles.brandIcon, { borderColor: `${t.primary}AA`, backgroundColor: 'rgba(12,22,40,0.5)' }]}>
                  <Ionicons name="car-sport-outline" size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.brandName}>AUTOGET</Text>
                  <Text style={styles.brandText}>Oficina moderna, atendimento humano</Text>
                </View>
              </View>

              <View style={[styles.eyebrowPill, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.14)' }]}>
                <Text style={styles.eyebrowText}>{eyebrow}</Text>
              </View>

              <Text style={[styles.heroTitle, isTablet && styles.heroTitleLarge]}>{title}</Text>
              <Text style={[styles.heroSubtitle, isTablet && styles.heroSubtitleLarge]}>{subtitle}</Text>

              {!!highlights?.length && (
                <View style={[styles.highlightList, isWide && styles.highlightListWide]}>
                  {highlights.map((item) => (
                    <View
                      key={item.title}
                      style={[
                        styles.highlightCard,
                        isWide && styles.highlightCardWide,
                        { backgroundColor: 'rgba(10,15,30,0.38)', borderColor: 'rgba(255,255,255,0.12)' },
                      ]}
                    >
                      <View style={[styles.highlightIcon, { backgroundColor: 'rgba(255,255,255,0.09)' }]}>
                        <Ionicons name={item.icon} size={18} color="#FFFFFF" />
                      </View>
                      <View style={styles.highlightTextWrap}>
                        <Text style={styles.highlightTitle}>{item.title}</Text>
                        <Text style={styles.highlightSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.formPanel, { backgroundColor: `${t.bgCard}F2`, borderColor: `${t.border}CC` }, isWide && styles.formPanelWide]}>
              <View style={styles.formHeader}>
                <Text style={[styles.formTitle, { color: t.text }]}>{cardTitle}</Text>
                <Text style={[styles.formSubtitle, { color: t.textSecondary }]}>{cardSubtitle}</Text>
              </View>
              {children}
              {footer ? <View style={styles.footer}>{footer}</View> : null}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  backgroundImage: { resizeMode: 'cover' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 10, 22, 0.64)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
    justifyContent: 'center',
  },
  shell: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
  },
  shellWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  heroPanel: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginBottom: 18,
  },
  heroPanelWide: {
    flex: 1,
    paddingRight: 20,
    marginBottom: 0,
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 22,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  brandIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  brandText: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 13,
    marginTop: 3,
  },
  eyebrowPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 14,
  },
  eyebrowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '900',
    maxWidth: 560,
  },
  heroTitleLarge: {
    fontSize: 42,
    lineHeight: 49,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 600,
  },
  heroSubtitleLarge: {
    fontSize: 17,
    lineHeight: 27,
    marginTop: 14,
  },
  highlightList: {
    marginTop: 22,
  },
  highlightListWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  highlightCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightCardWide: {
    width: '48%',
    marginHorizontal: 6,
  },
  highlightIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  highlightTextWrap: { flex: 1 },
  highlightTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  highlightSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  formPanel: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
  },
  formPanelWide: {
    width: 430,
    alignSelf: 'center',
  },
  formHeader: {
    marginBottom: 18,
  },
  formTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
  },
  formSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  footer: {
    marginTop: 18,
  },
});