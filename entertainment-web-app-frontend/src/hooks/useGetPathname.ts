import { useLocation } from "react-router-dom";

export default function useGetPathname(): string {
  const location = useLocation();
  return location.pathname.replace("/", "");
}
