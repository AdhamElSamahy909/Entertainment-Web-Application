import { setSearchTerm } from "../services/api/searchSlice";
import { CiSearch } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../services/api/store";

function SearchBar() {
  const dispatch = useAppDispatch();
  const { searchTerm } = useAppSelector((state) => state.search);

  return (
    <header className="my-[1.5rem] w-full">
      <form className="flex gap-[1rem] w-full">
        <CiSearch className="xl:w-[2rem] xl:h-[2rem] w-[1.5rem] h-[1.5rem] text-white stroke-1" />
        <div className="flex group flex-col w-full gap-[2rem] relative after:block after:content-[''] after:border-solid after:border-b-[1px] after:border-display after:mt-[-1rem] after:w-[calc(100%-1rem)] after:self-end after:opacity-0 has-[:focus]:after:opacity-100 after:transition-opacity">
          <input
            type="text"
            className="w-full peer caret-primary custom-caret block bg-inherit xl:text-[1.5rem] text-white  dark:placeholder:opacity-50 focus:outline-none"
            placeholder="Search for movies or TV series"
            value={searchTerm}
            onChange={(event) => dispatch(setSearchTerm(event.target.value))}
          />
        </div>
      </form>
    </header>
  );
}

export default SearchBar;
