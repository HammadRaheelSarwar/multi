const { supabaseAdmin } = require('../config/supabase');

const isBusinessOwner = async (req, res, next) => {
  try {
    const businessId = req.params.businessId || req.body.business || req.params.id;
    if (!businessId) {
      return res.status(400).json({ success: false, message: 'Business ID is required' });
    }

    const { data: business, error } = await supabaseAdmin
      .from('businesses')
      .select('id, owner_id')
      .eq('id', businessId)
      .single();

    if (error || !business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    if (business.owner_id !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only the business owner is authorized' });
    }

    req.business = business;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { isBusinessOwner };
