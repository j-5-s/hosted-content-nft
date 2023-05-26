import { useRouter } from "next/router";

export function getFirstQueryParam(key: string) {
  const router = useRouter();
  const param = router.query[key];

  if (Array.isArray(param)) {
    return String(param[0]);
  }

  return String(param || "");
}
