
const vars = [
    'STRIPE_SECRET_KEY',
    'RESEND_API_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

console.log('--- Environment Check ---');
vars.forEach(v => {
    const val = process.env[v];
    console.log(`${v}: ${val ? (val.length > 5 ? 'EXISTS (length: ' + val.length + ')' : 'SHORT VALUE: ' + val) : 'MISSING'}`);
});
console.log('-------------------------');
