import { Route } from 'react-router-dom';
import { routes } from '.';

const renderRoutes = () => {
    return routes.map((route) => {
        if (route.nested) {
            return (
                <Route key={route.path} path={route.path} element={<route.element />}>
                    {route.nested.map((item) => (
                        <Route key={item.path} path={item.path} element={<item.element />} />
                    ))}
                </Route>
            );
        } else {
            return <Route key={route.path} path={route.path} element={<route.element />} />;
        }
    })
}

export { renderRoutes };
