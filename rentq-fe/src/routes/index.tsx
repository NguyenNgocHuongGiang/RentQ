import { lazy } from "react";

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
      {
        path: "",
        element: lazy(() => import("./../pages/UserTemplate/Homepage")),
      },
      {
        path: "tim-tro",
        element: lazy(() => import("./../pages/UserTemplate/RoomFinderPage")),
      },
      {
        path: "lien-he",
        element: lazy(() => import("./../pages/UserTemplate/ContactPage")),
      },
      {
        path: "o-ghep",
        element: lazy(() => import("./../pages/UserTemplate/RoommateRequestPage")),
      },
      {
        path: "cho-thue",
        element: lazy(() => import("./../pages/UserTemplate/DiscoveryPage")),
        nested: [
          {
            path: "detail/:alias",
            element: lazy(() => import("./../pages/UserTemplate/DetailPostPage/MiniDetailPost")),
          },
        ]
      },
      {
        path: "request-role",
        element: lazy(() => import("./../pages/UserTemplate/RequestRole")),
      },
      {
        path: "me/:userId",
        element: lazy(() => import("./../pages/UserTemplate/ProfilePage/MyProfile")),
      },
      {
        path: "me",
        element: lazy(() => import("./../pages/UserTemplate/ProfilePage")),
        nested: [
          {
            path: "user-information",
            element: lazy(
              () =>
                import("./../pages/UserTemplate/ProfilePage/UserInformation")
            ),
          },
          {
            path: "contracts",
            element: lazy(
              () => import("./../pages/UserTemplate/ProfilePage/MyContracts")
            ),
          },
          {
            path: "save-posts",
            element: lazy(
              () => import("../pages/UserTemplate/ProfilePage/SavePosts")
            ),
          },
          {
            path: "bills",
            element: lazy(
              () => import("../pages/UserTemplate/ProfilePage/MyBills")
            ),
          },
        ],
      },
      {
        path: "detailpost/:alias",
        element: lazy(() => import("./../pages/UserTemplate/DetailPostPage")),
      },
      {
        path: "message",
        element: lazy(() => import("./../pages/UserTemplate/MessagePage")),
      },
      {
        path: "search",
        element: lazy(() => import("./../pages/UserTemplate/SearchPage")),
      },
      {
        path: "contract-template",
        element: lazy(
          () => import("./../pages/AdminTemplate/Contracts/ContractTemplate")
        ),
      },
    ],
  },
  {
    path: "/manage",
    element: lazy(() => import("./../pages/AdminTemplate")),
    nested: [
      {
        path: "dashboard",
        element: lazy(() => import("./../pages/AdminTemplate/Dashboard")),
      },
      {
        path: "properties",
        element: lazy(() => import("./../pages/AdminTemplate/Properties")),
      },
      {
        path: "contracts",
        element: lazy(() => import("./../pages/AdminTemplate/Contracts")),
      },
      {
        path: "bills",
        element: lazy(() => import("./../pages/AdminTemplate/Bills")),
      },
    ],
  },
  {
    path: "/auth",
    element: lazy(() => import("./../pages/AuthTemplate")),
    nested: [
      {
        path: "login",
        element: lazy(() => import("./../pages/AuthTemplate/LoginPage")),
      },
      {
        path: "register",
        element: lazy(() => import("./../pages/AuthTemplate/RegisterPage")),
      },
      {
        path: "forgotPass",
        element: lazy(
          () => import("./../pages/AuthTemplate/ForgotPasswordPage")
        ),
      },
      {
        path: "verify-success",
        element: lazy(
          () => import("../pages/AuthTemplate/Verification/verifySuccess")
        ),
      },
      {
        path: "verify-fail",
        element: lazy(
          () => import("../pages/AuthTemplate/Verification/verifyFail")
        ),
      },
    ],
  },
];

export { routes };
