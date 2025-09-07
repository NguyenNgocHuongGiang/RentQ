import { Suspense } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify';
import { Navigate, Route, Routes } from 'react-router-dom';
import { renderRoutes } from './routes/routes';
import PageNotFound from './pages/PageNotFound';
import Loading from './components/Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ToastContainer position="top-right"/>

      <Routes>
        <Route path="/manage" element={<Navigate replace to="/manage/dashboard" />} />
        {renderRoutes()}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App
