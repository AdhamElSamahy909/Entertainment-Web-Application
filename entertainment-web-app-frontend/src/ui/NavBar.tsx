import NavItem from "./NavItem";
import { CiLogout } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../services/api/themeSlice";
import { IconContext } from "react-icons/lib";
import { useLogoutMutation } from "../services/api/authApiSlice";
import { RootState } from "../services/api/store";

const destinations = ["/", "/movies", "/tvseries", "/bookmarked"];
function NavBar() {
  const [logout] = useLogoutMutation();
  const { mode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function handleLogout() {
    logout();
  }

  return (
    <aside className="flex flex-shrink-0 sm:w-full justify-between items-center px-[1.25rem] py-9 xl:flex-col xl:w-[6rem] xl:h-full sm:rounded-[0.625rem] xl:rounded-[1.25rem] bg-accent">
      <img
        src="/assets/logo.svg"
        className="h-[1.25rem] w-[1.5rem] sm:w-[2rem] sm:h-[1.5rem] sm:mb-24"
        alt="logo"
      />

      <nav className="flex text-center xl:flex-col xl:mt-[-23rem] xl:py-[9rem] justify-center items-center h-[1rem] gap-[1.5rem]">
        {destinations?.map((destination) => (
          <NavItem
            className="flex-1"
            key={destination}
            destination={destination}
          />
        ))}
      </nav>

      <div className="flex xl:flex-col gap-5 justify-center items-center">
        <IconContext.Provider
          value={{
            className:
              "w-full h-full hover:fill-primary cursor-pointer text-secondary dark:text-white",
          }}
        >
          <CiLogout
            onClick={handleLogout}
            className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem]"
          />

          <button
            onClick={handleToggleTheme}
            className="w-full h-full sm:w-[2rem] sm:h-[2rem]"
          >
            {mode === "light" ? (
              <CiDark className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem]" />
            ) : (
              <CiLight className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem]" />
            )}
          </button>
        </IconContext.Provider>

        <img
          src="/assets/image-avatar.png"
          className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem]"
          alt=""
        />
      </div>
    </aside>
  );
}

export default NavBar;
