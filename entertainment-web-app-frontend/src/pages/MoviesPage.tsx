import { useGetMoviesTvSeriesQuery } from "../services/api/moviesTVSeriesApiSlice";
import Loader from "../ui/Loader";
import ShowsGrid from "../ui/ShowsGrid";

function MoviesPage() {
  const { data, isLoading } = useGetMoviesTvSeriesQuery();
  const boomarked = data?.filter((show) => show.category === "Movie") ?? [];

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <h2 className="font-light text-[1.25rem] xl:text-[2rem]">Movies</h2>
      <ShowsGrid shows={boomarked} />
    </div>
  );
}

export default MoviesPage;
