import { useRouter } from "next/router";

export const useNavigate = () => {
  const router = useRouter();
  return router.push;
};
