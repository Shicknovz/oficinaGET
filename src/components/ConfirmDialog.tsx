import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';
import ModalShell from './ModalShell';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: Props) {
  const t = useTheme();

  return (
    <ModalShell
      visible={visible}
      title={title}
      subtitle="Confira a ação antes de continuar."
      onClose={onCancel}
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title={cancelLabel} variant="outline" onPress={onCancel} fullWidth style={{ flex: 1 }} />
          <Button title={confirmLabel} variant="danger" onPress={onConfirm} fullWidth style={{ flex: 1 }} />
        </View>
      }
    >
      <Text style={{ color: t.textSecondary, fontSize: 14, lineHeight: 22 }}>{message}</Text>
    </ModalShell>
  );
}