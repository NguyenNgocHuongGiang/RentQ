import ReactDOM from 'react-dom/client';
import App from './App';
// import { store } from './store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter should be here
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </Provider>
);
