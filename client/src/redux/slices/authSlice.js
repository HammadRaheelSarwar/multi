import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('accessToken') || null,
  session: null,
  isAuthenticated: !!localStorage.getItem('accessToken') && !!localStorage.getItem('user'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, session, accessToken } = action.payload;
      state.user = user;
      state.session = session || null;
      state.token = session?.access_token || accessToken || null;
      state.isAuthenticated = !!state.token;
      
      localStorage.setItem('user', JSON.stringify(user));
      if (state.token) localStorage.setItem('accessToken', state.token);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.session = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
    setSession: (state, action) => {
      const { session, user } = action.payload || {};
      state.session = session || null;
      state.token = session?.access_token || null;
      state.user = user || null;
      state.isAuthenticated = !!session;
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (session?.access_token) localStorage.setItem('accessToken', session.access_token);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
});

export const { setCredentials, setSession, logOut, updateUser } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
