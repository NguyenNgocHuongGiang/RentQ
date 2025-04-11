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
      { path: "request-role", element: lazy(() => import("./../pages/UserTemplate/RequestRole"))},
      { 
        path: "me", 
        element: lazy(() => import("./../pages/UserTemplate/ProfilePage")),
        nested: [
          { path: "", element: lazy(() => import("./../pages/UserTemplate/ProfilePage/MyProfile")) },
          { path: "save-posts", element: lazy(() => import("./../pages/UserTemplate/ProfilePage/Posts")) },
        ]
      },
      { path: "detailpost/:alias", element: lazy(() => import("./../pages/UserTemplate/DetailPostPage"))},
    ]
  },
  {
    path: "/manage",
    element: lazy(() => import("./../pages/AdminTemplate")),
    nested: [

    ],
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
