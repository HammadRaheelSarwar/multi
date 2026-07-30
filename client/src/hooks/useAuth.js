import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, logOut, setCredentials, updateUser } from '../redux/slices/authSlice';
import api from '../services/api';
import { signInWithSupabase, signUpWithSupabase, signOutSupabase, signInWithGoogle } from '../services/supabase';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const loginUser = async (email, password) => {
    const data = await signInWithSupabase(email, password);
    dispatch(setCredentials(data));
    return { success: true, data };
  };

  const registerUser = async (fullName, email, phone, password, role) => {
    const data = await signUpWithSupabase(email, password, { full_name: fullName, phone, role });
    if (data.session) dispatch(setCredentials(data));
    return { success: true, data };
  };

  const logoutUser = async () => {
    try {
      await signOutSupabase();
    } catch (error) {
      console.error('Logout request failed:', error.message);
    } finally {
      dispatch(logOut());
    }
  };

  const socialLogin = async (provider, payload) => {
    if (provider !== 'google') throw new Error('Only Google OAuth is supported by Supabase');
    return signInWithGoogle();
  };

  const updateProfile = async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    if (response.data.success) {
      dispatch(updateUser(response.data.data));
    }
    return response.data;
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    user,
    isAuthenticated,
    loginUser,
    registerUser,
    logoutUser,
    socialLogin,
    updateProfile,
    hasRole,
  };
};
