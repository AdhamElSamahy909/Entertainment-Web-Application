import useScreenWidth from "../hooks/useScreenWidth";
import BookmarkButton from "./BookmarkButton";
import PlayButton from "./PlayButton";
import ShowInfoBox from "./ShowInfoBox";
import { MovieTVSeries } from "../types/models";

interface ShowBoxProps {
  show: MovieTVSeries;
}

function ShowBox({ show }: ShowBoxProps) {
  const screenWidth = useScreenWidth();

  type RegularImageSize = keyof MovieTVSeries["thumbnail"]["regular"];

  let sizeOfImage: RegularImageSize;

  sizeOfImage =
    screenWidth < 640 ? "small" : screenWidth < 768 ? "medium" : "large";

  return (
    <div className="flex flex-col gap-[1rem]">
      <div className="w-full h-auto relative group cursor-pointer">
        <img
          src={show.thumbnail.regular[sizeOfImage].replace(".", "")}
          className="rounded-[0.5rem] object-cover"
          alt="thumbnail"
        />
        <BookmarkButton show={show} />
        <PlayButton show={show} />
      </div>
      <ShowInfoBox show={show} />
    </div>
  );
}

export default ShowBox;
