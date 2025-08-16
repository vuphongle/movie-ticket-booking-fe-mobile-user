import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const ProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>👤 Cá Nhân</Text>
        <Text style={styles.description}>
          Quản lý thông tin cá nhân và lịch sử đặt vé
        </Text>
        <Text style={styles.subtitle}>Thông tin cá nhân</Text>
        <Text style={styles.placeholder}>
          - Thông tin tài khoản sẽ được hiển thị ở đây
        </Text>
        <Text style={styles.subtitle}>Lịch sử đặt vé</Text>
        <Text style={styles.placeholder}>
          - Danh sách vé đã đặt sẽ được hiển thị ở đây
        </Text>
        <Text style={styles.subtitle}>Cài đặt</Text>
        <Text style={styles.placeholder}>
          - Các tùy chọn cài đặt sẽ được hiển thị ở đây
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 10,
  },
});

export default ProfileScreen;
