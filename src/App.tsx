import { Provider } from "react-redux";

import "./App.css";
import InboxScreen from "./components/InboxScreen";
import "./index.css";
import store from "./lib/store";

function App() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  );
}

export default App;
