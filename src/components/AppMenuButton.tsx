import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAppMenu } from '../context/AppMenuContext';

const MENU_ROUTES = ['Dashboard', 'Clientes', 'OS', 'Financeiro'] as const;

export default function AppMenuButton() {
  const t = useTheme();
  const navigation = useNavigation<any>();
  const menu = useAppMenu();
  const [visible, setVisible] = React.useState(false);

  if (!menu) {
    return null;
  }

  const handleNavigate = (routeName: typeof MENU_ROUTES[number]) => {
    setVisible(false);
    navigation.navigate(routeName);
  };

  const handleLogout = () => {
    setVisible(false);
    menu.onLogout();
  };

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={[styles.menuBtn, { backgroundColor: t.bgCard }]} activeOpacity={0.85}>
        <View style={styles.menuBar} />
        <View style={styles.menuBar} />
        <View style={styles.menuBar} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
          <View style={[styles.menuContainer, { backgroundColor: t.bgCard }]}> 
            <Text style={[styles.menuTitle, { color: t.text }]}>Menu</Text>
            {MENU_ROUTES.map((routeName) => (
              <TouchableOpacity key={routeName} style={styles.menuItem} onPress={() => handleNavigate(routeName)}>
                <Text style={[styles.menuItemText, { color: t.primary }]}>{routeName}</Text>
              </TouchableOpacity>
            ))}
            <View style={[styles.menuDivider, { backgroundColor: t.border }]} />
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuItemText, { color: t.danger }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#24324B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 5,
  },
  menuBar: {
    width: 28,
    height: 3,
    backgroundColor: '#A0A4B8',
    borderRadius: 2,
    marginVertical: 2,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContainer: {
    marginTop: 60,
    marginLeft: 18,
    borderRadius: 18,
    padding: 20,
    minWidth: 220,
    borderWidth: 1,
    borderColor: '#24324B',
    elevation: 8,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    marginVertical: 10,
  },
});