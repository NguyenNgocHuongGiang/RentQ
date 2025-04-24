import ReactDOM from "react-dom/client";
import App from "./App";
import "leaflet/dist/leaflet.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // BrowserRouter should be here
import { store } from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
