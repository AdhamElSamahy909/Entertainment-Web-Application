import { useSearchQuery } from "../services/api/moviesTVSeriesApiSlice";
import ShowsGrid from "./ShowsGrid";
import useGetPathname from "../hooks/useGetPathname.ts";
import { useAppSelector } from "../services/api/store.ts";

function SearchedShows() {
  const pathname = useGetPathname();
  const { searchTerm } = useAppSelector((state) => state.search);
  const { data: searchResult } = useSearchQuery(
    { category: pathname, search: searchTerm },
    {
      skip: searchTerm.length === 0,
    }
  );

  console.log("Search Result: ", searchResult);

  const shows = searchResult ?? [];

  return (
    <div className="flex flex-col gap-[1.5rem] w-full">
      <h2 className="text-[1.25rem] xl:text-[2rem] font-light leading-[-0.31px]">
        Found {shows?.length} for &apos;{searchTerm}&apos;
      </h2>

      <ShowsGrid shows={shows} />
    </div>
  );
}

export default SearchedShows;
