import { Route } from "react-router-dom";
import { routes } from ".";

const renderRoutes = () => {
  return routes.map((route) => {
    if (route.nested) {
      return (
        <Route key={route.path} path={route.path} element={<route.element />}>
          {route.nested.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<item.element />}
            >
                {item.nested?.map((i) => (
                    <Route
                        key={i.path}
                        path={i.path}
                        element={<i.element />}
                    />
                )) ?? []}
            </Route>
          ))}
        </Route>
      );
    } else {
      return (
        <Route key={route.path} path={route.path} element={<route.element />} />
      );
    }
  });
};

export { renderRoutes };
