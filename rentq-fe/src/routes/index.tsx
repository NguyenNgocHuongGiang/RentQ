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
      { path: "profile", element: lazy(() => import("./../pages/UserTemplate/ProfilePage"))},
      { path: "detailpost/:alias", element: lazy(() => import("./../pages/UserTemplate/DetailPostPage"))},
    ]
  },
  {
    path: "/auth",
    element: lazy(() => import("./../pages/AuthTemplate")),
    nested: [
      { path: "login", element: lazy(() => import("./../pages/AuthTemplate/LoginPage"))},
      { path: "register", element: lazy(() => import("./../pages/AuthTemplate/RegisterPage"))},
      { path: "forgotPass", element: lazy(() => import("./../pages/AuthTemplate/ForgotPasswordPage"))},
      { path: "verify-success", element: lazy(() => import("../pages/AuthTemplate/Verification/verifySuccess"))},
      { path: "verify-fail", element: lazy(() => import("../pages/AuthTemplate/Verification/verifyFail"))},
    ]
  },
];

export { routes };
