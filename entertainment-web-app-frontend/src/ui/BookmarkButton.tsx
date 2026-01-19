import toast from "react-hot-toast";
import {
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "../services/api/moviesTVSeriesApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentAuthSate } from "../services/api/authSlice";
import { MovieTVSeries } from "../types/models";

interface BookmarkButtonProps {
  show: MovieTVSeries;
}

function BookmarkButton({ show }: BookmarkButtonProps) {
  const [removeBookmark, { isLoading: isRemoving }] =
    useRemoveBookmarkMutation();
  const [addBookmark, { isLoading: isBookmarking }] = useAddBookmarkMutation();
  const { user: currentUser } = useSelector(selectCurrentAuthSate);

  const isBookmarked = currentUser?.bookmarks?.includes(show._id);

  async function handleBookmark() {
    try {
      let response;
      if (isBookmarked) {
        response = await removeBookmark(show._id).unwrap();
        toast.success("Removed from bookmarked");
      } else {
        response = await addBookmark(show._id).unwrap();
        toast.success("Added to bookmarked");
      }

      console.log("Response from boomark/unbookmark: ", response);
    } catch (error) {
      console.log(error);
      if (isBookmarked) toast.error("Failed to add to bookmarked");
      else toast.error("Failed to remove from bookmarked");
    }
  }

  // if (isRemoving || isBookmarking) {
  //   return (
  //     <div className="absolute cursor-not-allowed flex justify-center items-center top-[0.5rem] right-[0.5rem] sm:top-[1rem] sm:right-[1rem] bg-accent bg-opacity-50 w-[2rem] h-[2rem] rounded-full">
  //       <div className="w-4 h-4 border-2 border-t-transparent dark:border-t-black border-secondary dark:border-white rounded-full animate-spin"></div>
  //     </div>
  //   );
  // }

  return (
    <div
      onClick={handleBookmark}
      className="absolute cursor-pointer flex justify-center items-center top-[0.5rem] right-[0.5rem] sm:top-[1rem] sm:right-[1rem] bg-accent bg-opacity-50 w-[2rem] h-[2rem] rounded-full"
    >
      <img
        src={
          isBookmarked === true
            ? "/assets/icon-bookmark-full.svg"
            : "/assets/icon-bookmark-empty.svg"
        }
        alt="Bookmark image"
      />
    </div>
  );
}

export default BookmarkButton;
