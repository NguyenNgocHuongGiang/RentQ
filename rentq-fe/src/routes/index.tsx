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
      { path: "forgotPass", element: lazy(() => import("./../pages/AuthTemplate/ForgotPasswordPage"))},
      { path: "vertify-success", element: lazy(() => import("../pages/AuthTemplate/Verification/verifySuccess"))},
      { path: "vertify-fail", element: lazy(() => import("../pages/AuthTemplate/Verification/verifyFail"))},
    ]
  },
];

export { routes };
