import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const BookingScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎫 Đặt Vé</Text>
        <Text style={styles.description}>
          Chọn phim và đặt vé xem phim yêu thích
        </Text>
        <Text style={styles.subtitle}>Rạp gần bạn</Text>
        <Text style={styles.placeholder}>
          - Danh sách rạp chiếu phim sẽ được hiển thị ở đây
        </Text>
        <Text style={styles.subtitle}>Suất chiếu</Text>
        <Text style={styles.placeholder}>
          - Lịch chiếu phim sẽ được hiển thị ở đây
        </Text>
        <Text style={styles.subtitle}>Chọn ghế</Text>
        <Text style={styles.placeholder}>
          - Sơ đồ ghế ngồi sẽ được hiển thị ở đây
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

export default BookingScreen;
