import React from 'react';
import { ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface HeroStat {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

interface Props {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  stats?: HeroStat[];
}

export default function SectionHero({ eyebrow, title, subtitle, image, stats = [] }: Props) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 430;

  return (
    <View style={styles.wrapper}>
      <ImageBackground source={{ uri: image }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.eyebrowPill}>
            <Text style={styles.eyebrowText}>{eyebrow}</Text>
          </View>
          <Text style={[styles.title, isCompact && styles.titleCompact]}>{title}</Text>
          <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>{subtitle}</Text>

          {stats.length > 0 && (
            <View style={[styles.statsRow, isCompact && styles.statsRowCompact]}>
              {stats.map((stat) => (
                <View key={`${stat.label}-${stat.value}`} style={[styles.statCard, { backgroundColor: `${t.bgCard}E6`, borderColor: `${t.border}CC` }, isCompact && styles.statCardCompact]}>
                  <View style={[styles.iconWrap, { backgroundColor: `${t.primary}22` }]}>
                    <Ionicons name={stat.icon} size={16} color={t.primary} />
                  </View>
                  <View style={styles.statTextWrap}>
                    <Text style={[styles.statValue, { color: t.text }]}>{stat.value}</Text>
                    <Text style={[styles.statLabel, { color: t.textSecondary }]}>{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  hero: {
    minHeight: 220,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 10, 22, 0.58)',
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  eyebrowPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 12,
  },
  eyebrowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    maxWidth: 620,
  },
  titleCompact: {
    fontSize: 23,
    lineHeight: 29,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 640,
  },
  subtitleCompact: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: -4,
  },
  statsRowCompact: {
    marginTop: 14,
  },
  statCard: {
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  statCardCompact: {
    width: '100%',
    minWidth: 0,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statTextWrap: {
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});