const { supabaseAuthGuard } = require('./supabaseAuth');

/**
 * protect — validates Supabase Bearer JWT and attaches user to req.user
 */
const protect = (req, res, next) => supabaseAuthGuard(req, res, () => {
  const user = req.supabaseUser;
  req.user = { id: user.id, email: user.email, role: user.user_metadata?.role || 'customer', fullName: user.user_metadata?.full_name || '', ...user.user_metadata };
  next();
});

/**
 * restrictTo — role-based access control
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user ? req.user.role : 'none'}) is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
