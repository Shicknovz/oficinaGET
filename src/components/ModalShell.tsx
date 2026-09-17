import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface Props {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
  maxHeight?: DimensionValue;
}

export default function ModalShell({
  visible,
  title,
  subtitle,
  onClose,
  children,
  footer,
  scrollable = false,
  maxHeight = '82%',
}: Props) {
  const t = useTheme();

  const content = scrollable ? (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View>{children}</View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border, maxHeight }]}> 
          <View style={styles.glowLine} />
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={[styles.title, { color: t.text }]}>{title}</Text>
              {subtitle ? <Text style={[styles.subtitle, { color: t.textSecondary }]}>{subtitle}</Text> : null}
            </View>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.closeButton, { backgroundColor: t.bgInput, borderColor: t.border, opacity: pressed ? 0.78 : 1 }]}>
              <Ionicons name="close" size={20} color={t.textSecondary} />
            </Pressable>
          </View>
          {content}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 8, 18, 0.62)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 20,
    overflow: 'hidden',
  },
  glowLine: {
    position: 'absolute',
    top: 0,
    left: 18,
    right: 18,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#6EA8FE',
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 0,
  },
  footer: {
    marginTop: 16,
  },
});