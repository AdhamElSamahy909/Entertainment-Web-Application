import { MovieTVSeries } from "../types/models";
import ShowBox from "./ShowBox";

interface ShowsGridProps {
  shows: MovieTVSeries[];
}

function ShowsGrid({ shows }: ShowsGridProps) {
  return (
    <div className="grid grid-cols-2 max-w-screen sm:grid-cols-3 xl:grid-cols-4 gap-[1rem] sm:gap-[1.5rem] xl:gap-[2.5rem]">
      {shows?.map((show) => <ShowBox key={show._id} show={show} />)}
    </div>
  );
}

export default ShowsGrid;
