// Single server-side Supabase entry point. The service-role client is never
// exposed to the browser and is used only by the Express API.
module.exports = require('../config/supabase');
