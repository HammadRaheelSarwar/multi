const { supabaseAdmin, isSupabaseServerConfigured } = require('../config/supabase');

const supabaseAuthGuard = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }

  if (!isSupabaseServerConfigured()) {
    return res.status(500).json({
      success: false,
      message: 'Supabase server configuration missing on server',
    });
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Supabase token',
      });
    }

    req.supabaseUser = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Supabase token authentication failed',
      error: err.message,
    });
  }
};

module.exports = { supabaseAuthGuard };
