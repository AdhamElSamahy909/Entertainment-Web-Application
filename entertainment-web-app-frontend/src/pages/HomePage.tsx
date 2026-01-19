import { useGetMoviesTvSeriesQuery } from "../services/api/moviesTVSeriesApiSlice";
import Loader from "../ui/Loader";
import TrendingBar from "../ui/TrendingBar";
import ShowsGrid from "../ui/ShowsGrid";
import useScreenWidth from "../hooks/useScreenWidth";

function HomePage() {
  const { data, isLoading } = useGetMoviesTvSeriesQuery();
  const screenWidth = useScreenWidth();
  const trending = data?.filter((show) => show.isTrending != false) ?? [];
  const shows = data ?? [];
  console.log("SW: ", screenWidth);

  console.log("Movies: ", data);
  if (isLoading) return <Loader />;

  return (
    <div className="w-full flex flex-col">
      <div className="scrollbar-hide overflow-scroll">
        <TrendingBar trending={trending} />
      </div>

      <div className="flex flex-col gap-[1.5rem]">
        <h2 className="font-light text-[1.25rem] xl:text-[2rem]">
          Recommended for you
        </h2>
        <ShowsGrid shows={shows} />
      </div>
    </div>
  );
}

export default HomePage;
