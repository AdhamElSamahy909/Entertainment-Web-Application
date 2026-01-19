import { useEffect } from "react";
import { useGetBookmarkedQuery } from "../services/api/moviesTVSeriesApiSlice";
import Loader from "../ui/Loader";
import ShowsGrid from "../ui/ShowsGrid";

function BookmarkedPage() {
  const { data: bookmarks, isLoading: isLoadingBookmarks } =
    useGetBookmarkedQuery();

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/users/bookmarks", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log("Fetched bookmarks:", data))
      .catch((err) => console.error("Error fetching bookmarks:", err));
  }, []);

  console.log("Bookmarked shows for this user are: ", bookmarks);

  console.log(
    "Data for bookmarks: ",
    bookmarks?.map((bookamrk) => bookamrk.title)
  );

  const bookmarkedShows = bookmarks ?? [];

  if (isLoadingBookmarks) return <Loader />;

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <h2 className="font-light text-[1.25rem] xl:text-[2rem]">
        {bookmarks?.length === 0
          ? "You have no bookmarked shows"
          : "Bookmarked"}
      </h2>
      {bookmarkedShows.length > 0 && <ShowsGrid shows={bookmarkedShows} />}
    </div>
  );
}

export default BookmarkedPage;
