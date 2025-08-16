import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const NewsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📰 Tin Tức</Text>
        <Text style={styles.description}>
          Cập nhật tin tức mới nhất về điện ảnh
        </Text>
        <Text style={styles.subtitle}>Tin tức nổi bật</Text>
        <Text style={styles.placeholder}>
          - Các bài viết tin tức nổi bật sẽ được hiển thị ở đây
        </Text>
        <Text style={styles.subtitle}>Đánh giá phim</Text>
        <Text style={styles.placeholder}>
          - Các bài đánh giá phim sẽ được hiển thị ở đây
        </Text>
        <Text style={styles.subtitle}>Khuyến mãi</Text>
        <Text style={styles.placeholder}>
          - Thông tin khuyến mãi sẽ được hiển thị ở đây
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

export default NewsScreen;
