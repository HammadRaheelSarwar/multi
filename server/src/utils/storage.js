const path = require('path');
const crypto = require('crypto');
const { supabaseAdmin } = require('../config/supabase');

const uploadToStorage = async (file, bucket, folder = 'uploads') => {
  if (!supabaseAdmin) throw new Error('Supabase is not configured');
  const ext = path.extname(file.originalname || '').toLowerCase();
  const objectPath = `${folder}/${crypto.randomUUID()}${ext}`;
  const { error } = await supabaseAdmin.storage.from(bucket).upload(objectPath, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw error;
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
};

module.exports = { uploadToStorage };
