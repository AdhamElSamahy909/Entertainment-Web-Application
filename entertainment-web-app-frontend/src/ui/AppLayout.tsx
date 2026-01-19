import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import Loader from "./Loader";
import SearchedShows from "./SearchedShows";
import { useSearchQuery } from "../services/api/moviesTVSeriesApiSlice";
import { useSelector } from "react-redux";
import useGetPathname from "../hooks/useGetPathname.ts";
import { RootState } from "../services/api/store.ts";

function AppLayout() {
  const pathname = useGetPathname();
  const { searchTerm } = useSelector((state: RootState) => state.search);
  const { isLoading: isSearching } = useSearchQuery(
    {
      category: pathname,
      search: searchTerm,
    },
    {
      skip: searchTerm.length === 0,
    }
  );

  return (
    <div className="flex xl:flex-row xl:gap-[2rem] h-screen w-full flex-col sm:items-center xl:p-[2rem] sm:p-5">
      <NavBar />

      <div className="flex xl:w-[calc(100%-8rem)] w-full h-full flex-grow-0 flex-col p-[0.5rem] sm:p-0">
        <SearchBar />

        <main className="flex flex-col w-full h-full text-white">
          {isSearching ? (
            <Loader />
          ) : searchTerm.length !== 0 ? (
            <SearchedShows />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
