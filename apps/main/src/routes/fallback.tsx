import ErrorUI from "@/app/error/error-ui";
import { NotFound } from "@pacepard/ui/components/not-found";



export const fallbackRoutes = [

  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/route-fallback",
    element: <ErrorUI />,
  },
];
