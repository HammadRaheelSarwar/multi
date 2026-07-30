const { supabaseAdmin } = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Exchange a Supabase OAuth session code for a full session.
 * After Supabase redirects the user to /auth/callback, the client exchanges
 * the PKCE code for a session. This route is kept for server-side flows.
 *
 * @route POST /api/auth/social/callback
 */
const oauthCallback = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return sendError(res, 'Authorization code is required', 400);
  }

  const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return sendError(res, error?.message || 'OAuth exchange failed', 401);
  }

  const { session, user } = data;

  // Ensure profile row exists
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!existingProfile) {
    await supabaseAdmin.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url || null,
      role: user.user_metadata?.role || 'customer',
    });
  }

  return sendSuccess(res, {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || user.user_metadata?.name,
      role: user.user_metadata?.role || 'customer',
      avatar: user.user_metadata?.avatar_url || null,
    },
  }, 'OAuth login successful');
});

/**
 * Legacy Google login via ID token (for apps using Google One-Tap).
 * @route POST /api/auth/social/google
 */
const googleLogin = asyncHandler(async (req, res) => {
  const { idToken, accessToken: googleAccessToken, role } = req.body;

  if (!idToken && !googleAccessToken) {
    return sendError(res, 'Google ID token or access token is required', 400);
  }

  // Supabase handles Google OAuth natively — this endpoint is for legacy One-Tap flows
  const { data, error } = await supabaseAdmin.auth.signInWithIdToken({
    provider: 'google',
    token: idToken || googleAccessToken,
  });

  if (error || !data.session) {
    return sendError(res, error?.message || 'Google sign-in failed', 401);
  }

  const { session, user } = data;

  // Update role in user_metadata if provided
  if (role) {
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, role },
    });
  }

  return sendSuccess(res, {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || user.user_metadata?.name,
      role: role || user.user_metadata?.role || 'customer',
      avatar: user.user_metadata?.avatar_url || null,
    },
  }, 'Logged in with Google successfully');
});

/**
 * Facebook login — Supabase handles Facebook OAuth natively via redirect.
 * This endpoint processes the session after the redirect.
 * @route POST /api/auth/social/facebook
 */
const facebookLogin = asyncHandler(async (req, res) => {
  return sendError(
    res,
    'Facebook login uses Supabase OAuth redirect flow. Use the client-side signInWithOAuth({ provider: "facebook" }).',
    400,
  );
});

module.exports = { googleLogin, facebookLogin, oauthCallback };
