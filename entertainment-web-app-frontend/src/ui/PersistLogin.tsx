import { useRefreshQuery } from "../services/api/authApiSlice";
import { Outlet } from "react-router-dom";
import Loader from "./Loader";

function PersistLogin() {
  const { isLoading } = useRefreshQuery();

  return isLoading ? <Loader /> : <Outlet />;
}

export default PersistLogin;
