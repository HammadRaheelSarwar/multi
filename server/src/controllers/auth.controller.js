const { supabaseAdmin } = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Register a new user via Supabase Auth
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;

  if (!fullName || !email || !password) {
    return sendError(res, 'Full name, email and password are required', 400);
  }

  // Create Supabase Auth user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,     // send confirmation email
    user_metadata: {
      full_name: fullName,
      phone: phone || '',
      role: role || 'customer',
    },
  });

  if (error) {
    const msg = error.message.includes('already registered')
      ? 'User already exists with this email address'
      : error.message;
    return sendError(res, msg, 400);
  }

  const user = data.user;

  // Manually upsert the profile row (the trigger handles it, but we do it here too as a safety net)
  await supabaseAdmin.from('profiles').upsert({
    id: user.id,
    full_name: fullName,
    email,
    phone: phone || null,
    role: role || 'customer',
  }, { onConflict: 'id' });

  return sendSuccess(
    res,
    { userId: user.id, email: user.email },
    'Account created! Please check your email to verify your account.',
    201,
  );
});

// @desc    Login via Supabase Auth
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Please provide email and password', 400);
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

  if (error) {
    return sendError(res, 'Invalid credentials', 401);
  }

  const { session, user } = data;

  // Fetch profile row for extra fields
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return sendSuccess(res, {
    user: {
      id: user.id,
      email: user.email,
      fullName: profile?.full_name || user.user_metadata?.full_name,
      role: profile?.role || user.user_metadata?.role || 'customer',
      avatar: profile?.avatar_url || null,
      phone: profile?.phone || null,
      isEmailVerified: !!user.email_confirmed_at,
    },
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
  }, 'Login successful');
});

// @desc    Logout — invalidates Supabase session
// @route   POST /api/auth/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  // Supabase session invalidation happens client-side with supabase.auth.signOut()
  // Server-side we can revoke the JWT if needed — for now just respond success
  return sendSuccess(res, null, 'Logged out successfully');
});

// @desc    Refresh Supabase session
// @route   POST /api/auth/refresh
// @access  Public
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error || !profile) {
    return sendError(res, 'User profile not found', 404);
  }

  return sendSuccess(res, profile, 'Fetched current user successfully');
});

// @desc    Update password via Supabase Auth
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return sendError(res, 'New password is required', 400);
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(req.user.id, {
    password: newPassword,
  });

  if (error) {
    return sendError(res, error.message, 400);
  }

  return sendSuccess(res, null, 'Password updated successfully');
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updatePassword,
};
