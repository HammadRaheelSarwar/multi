import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../../services/supabase';
import { setCredentials } from '../../redux/slices/authSlice';
import Spinner from '../../components/common/Spinner';

export default function AuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        dispatch(setCredentials({ session, user: session.user }));
        navigate('/', { replace: true });
      } else navigate('/login', { replace: true });
    });
    return () => { mounted = false; };
  }, [dispatch, navigate]);

  return <div className="min-h-screen flex items-center justify-center"><Spinner size="large" /></div>;
}
