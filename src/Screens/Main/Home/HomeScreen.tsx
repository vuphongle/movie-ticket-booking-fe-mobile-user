import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {PickView} from '@Components';
import {COLORS, SPACING, RADIUS} from '@Constants/theme';
import Header from './Components/Header';
import Banner from './Components/Banner';
import MovieSection from './Components/MovieSection';

// Mock data for demonstration
const mockBanners = [
  {
    id: '1',
    title: 'Ưu đãi đặc biệt',
    subtitle: 'Giảm 50% cho lần đặt vé đầu tiên',
    backgroundColor: '#e94560',
  },
  {
    id: '2',
    title: 'Phim mới ra mắt',
    subtitle: 'Những bộ phim blockbuster 2024',
    backgroundColor: '#3498db',
  },
  {
    id: '3',
    title: 'Combo tiết kiệm',
    subtitle: 'Vé + bỏng ngô + nước ngọt',
    backgroundColor: '#2ecc71',
  },
];

const mockNowShowingMovies = [
  {
    id: '1',
    title: 'Spider-Man: No Way Home',
    genre: 'Hành động, Phiêu lưu',
    rating: 8.4,
    duration: '148 phút',
  },
  {
    id: '2',
    title: 'The Batman',
    genre: 'Hành động, Tội phạm',
    rating: 7.8,
    duration: '176 phút',
  },
  {
    id: '3',
    title: 'Doctor Strange 2',
    genre: 'Hành động, Giả tưởng',
    rating: 6.9,
    duration: '126 phút',
  },
  {
    id: '4',
    title: 'Top Gun: Maverick',
    genre: 'Hành động, Drama',
    rating: 8.3,
    duration: '130 phút',
  },
];

const mockComingSoonMovies = [
  {
    id: '5',
    title: 'Avatar: The Way of Water',
    genre: 'Khoa học viễn tưởng',
    rating: 7.6,
    duration: '192 phút',
  },
  {
    id: '6',
    title: 'Black Panther: Wakanda Forever',
    genre: 'Hành động, Drama',
    rating: 6.7,
    duration: '161 phút',
  },
  {
    id: '7',
    title: 'The Flash',
    genre: 'Hành động, Phiêu lưu',
    rating: 6.4,
    duration: '144 phút',
  },
];

const HomeScreen: React.FC = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}>
      <Header />
      <PickView
        flex={1}
        style={styles.contentContainer}
        borderTopRadius={RADIUS.xl}
        backgroundColor={COLORS.background}>
        <Banner banners={mockBanners} />
        <MovieSection
          title="Phim đang chiếu"
          movies={mockNowShowingMovies}
          onSeeAll={() => console.log('See all now showing')}
        />
        <MovieSection
          title="Phim sắp chiếu"
          movies={mockComingSoonMovies}
          onSeeAll={() => console.log('See all coming soon')}
        />
      </PickView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    marginTop: -SPACING.lg,
    paddingTop: SPACING.xl,
    minHeight: 600,
  },
});

export default HomeScreen;
