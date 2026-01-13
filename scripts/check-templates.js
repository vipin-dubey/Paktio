const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkTemplates() {
    const { data, error } = await supabase
        .from('contracts')
        .select('id, title')
        .eq('is_template', true)
        .is('org_id', null)

    if (error) {
        console.error('Error fetching templates:', error)
        return
    }

    console.log('System Templates:')
    data.forEach(t => console.log(`- ${t.title} (${t.id})`))
}

checkTemplates()
