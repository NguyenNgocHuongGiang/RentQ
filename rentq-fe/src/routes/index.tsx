import { lazy } from 'react';

declare interface RouteConfig {
  path: string;
  element: any;
  nested?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: "",
    element: lazy(() => import("./../pages/UserTemplate")),
    nested: [
      { path: "/", element: lazy(() => import("./../pages/UserTemplate/Homepage"))},
      { path: "/discovery", element: lazy(() => import("./../pages/UserTemplate/DiscoveryPage"))},
      // { path: "/contact", element: lazy(() => import("./../pages/Contact/Contact"))},
      // { path: "/detail/:id", element: lazy(() => import("./../pages/Detail/Detail"))},
      // { path: "/history", element: lazy(() => import("./../pages/History/History"))},
    ]
  },

];

export { routes };
