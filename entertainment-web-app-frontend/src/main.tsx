import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./services/api/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("Google developer client id: ", clientId);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// "test": "echo \"Error: no test specified\" && exit 1",
// "start": "nodemon server.js"
{
  /* <GoogleOAuthProvider clientId="601922377518-84be0dfp94dkggb39boci4a5a3k2d69q.apps.googleusercontent.com"> */
}
