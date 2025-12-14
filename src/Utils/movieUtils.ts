export function getMovieTitle<T extends { name: string; nameEn?: string | null }>(
  movie: T,
  language: string
): string {
  const isEnglish = language?.toLowerCase().startsWith("en");
  if (isEnglish) {
    return movie.nameEn?.trim() || movie.name;
  }
  return movie.name;
}
