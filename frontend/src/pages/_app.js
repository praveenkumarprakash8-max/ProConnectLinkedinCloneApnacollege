import { store } from "../config/redux/reducer/store";
import { Provider } from "react-redux";
import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
