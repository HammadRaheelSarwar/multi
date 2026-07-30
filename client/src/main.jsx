import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';
import { supabase } from './services/supabase';
import { setSession, logOut } from './redux/slices/authSlice';

supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) store.dispatch(setSession({ session, user: session.user }));
});
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) store.dispatch(setSession({ session, user: session.user }));
  else store.dispatch(logOut());
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
