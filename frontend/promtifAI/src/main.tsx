import Navigation from './Navigation'
import { BrowserRouter } from 'react-router-dom';
import '../src/css/normalize.css'
import { Provider } from 'react-redux';
import { setupStore } from './store';
import { render } from "react-dom";
render(
  <BrowserRouter>
    <Provider store={setupStore()}>
      <Navigation />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root"));