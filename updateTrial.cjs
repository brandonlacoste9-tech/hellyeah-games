const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('Updating trial_seconds_remaining to 5400 for all FREE users...');
  
  // We can just update all users who are on FREE plan.
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ trial_seconds_remaining: 5400 })
    .eq('plan', 'FREE');
    
  if (error) {
    console.error('Error updating profiles:', error);
  } else {
    console.log('Successfully updated profiles!');
  }
}

run();
