import { lazy } from 'react';

declare interface RouteConfig {
  path: string;
  element: any;
  nested?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: "/",
    element: lazy(() => import("./../pages/UserTemplate")),
    nested: [
      { path: "", element: lazy(() => import("./../pages/UserTemplate/Homepage"))},
      { path: "discovery", element: lazy(() => import("./../pages/UserTemplate/DiscoveryPage"))},
    ]
  },
  {
    path: "/auth",
    element: lazy(() => import("./../pages/AuthTemplate")),
    nested: [
      { path: "login", element: lazy(() => import("./../pages/AuthTemplate/LoginPage"))},
      { path: "register", element: lazy(() => import("./../pages/AuthTemplate/RegisterPage"))},
    ]
  },
];

export { routes };
