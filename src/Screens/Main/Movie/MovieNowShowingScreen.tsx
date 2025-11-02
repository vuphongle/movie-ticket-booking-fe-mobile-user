type MovieListScreenProps = {
  type: "comingSoon" | "nowShowing";
  title: string;
  emptyText: string;
};

const MovieListScreen: React.FC<MovieListScreenProps> = ({ type, title, emptyText }) => {
  const { movies, isLoading, error } = useMovieList({ type });

  if (isLoading) return (
    <PickView flex={1} justifyCenter alignCenter backgroundColor={COLORS.primary}>
      <ActivityIndicator size="large" color={COLORS.accent} />
      <PickText size={16} style={{ color: "#fff", marginTop: SPACING.md }}>
        Đang tải {title.toLowerCase()}...
      </PickText>
    </PickView>
  );

  if (error) return (
    <PickView flex={1} justifyCenter alignCenter backgroundColor={COLORS.primary}>
      <PickText size={16} style={{ color: "#fff", marginBottom: SPACING.sm }}>
        Có lỗi xảy ra khi tải {title.toLowerCase()}
      </PickText>
    </PickView>
  );

  return (
    <ScrollView
      flex={1}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: COLORS.primary }}
      contentContainerStyle={{ padding: SPACING.lg }}
    >
      <PickText size={24} font="bold" style={{ color: "#fff", marginBottom: SPACING.md }}>
        {title}
      </PickText>

      {movies && movies.length > 0 ? (
        <MovieSection
          title=""
          movies={movies.map((m) => ({
            id: m.id.toString(),
            title: m.name,
            genre: m.genres.map((g) => g.name).join(", "),
            rating: m.rating,
            age: m.age ?? "P",
            graphics: m.graphics,
            duration: `${m.duration} phút`,
            imageUrl: m.poster,
          }))}
        />
      ) : (
        <PickText size={16} style={{ color: "#fff", textAlign: "center" }}>
          {emptyText}
        </PickText>
      )}
    </ScrollView>
  );
};
