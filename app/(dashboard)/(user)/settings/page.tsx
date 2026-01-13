import { createClient } from '@/lib/supabase/server'
import { updateProfile } from './actions'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please log in</div>

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <Breadcrumbs
                items={[
                    { label: 'User Settings' }
                ]}
            />
            <h1 className="text-3xl font-bold mb-8">User Settings</h1>

            <div className="bg-white shadow rounded-lg p-6 space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-primary">Personal Information</h2>
                    <form
                        action={async (formData) => {
                            'use server'
                            await updateProfile(formData)
                        }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">Full Name</label>
                                <input
                                    name="fullName"
                                    defaultValue={profile?.full_name || ''}
                                    className="mt-1 block w-full rounded-md border-muted bg-background px-3 py-2 text-foreground focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">Phone Number</label>
                                <input
                                    name="phoneNumber"
                                    defaultValue={profile?.phone_number || ''}
                                    className="mt-1 block w-full rounded-md border-muted bg-background px-3 py-2 text-foreground focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Email</label>
                            <input
                                disabled
                                value={user.email || ''}
                                className="mt-1 block w-full rounded-md border-muted bg-muted px-3 py-2 text-muted-foreground italic"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Locale</label>
                            <select
                                name="locale"
                                defaultValue={profile?.locale || 'en'}
                                className="mt-1 block w-full rounded-md border-muted bg-background px-3 py-2 text-foreground focus:ring-primary focus:border-primary"
                            >
                                <option value="en">English (Global)</option>
                                <option value="no">Norwegian (Bokmål)</option>
                                <option value="se">Swedish</option>
                                <option value="dk">Danish</option>
                            </select>
                        </div>

                        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
                            Save Changes
                        </button>
                    </form>
                </section>

                <hr className="border-muted" />

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-destructive">Security & MFA</h2>
                    <p className="text-muted-foreground mb-4">Multi-Factor Authentication adds an extra layer of security to your account.</p>
                    <button className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10">
                        {profile?.is_mfa_enabled ? 'Manage MFA' : 'Activate MFA'}
                    </button>
                </section>
            </div>
        </div>
    )
}
