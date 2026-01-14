import { createClient } from '@/lib/supabase/server'
import { updateProfile } from '@/lib/actions/settings'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export default async function SettingsPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const dictionary = await getDictionary(lang)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div className="p-8 text-center">{dictionary.settings.loginRequired}</div>

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-6 flex items-center justify-between gap-4">
                <Breadcrumbs
                    items={[
                        { label: dictionary.settings.title, icon: Settings }
                    ]}
                />
                <Link
                    href="/editor"
                    className="sm:hidden bg-foreground text-background p-3 rounded-2xl shadow-lg shadow-foreground/10 flex items-center justify-center transition-all active:scale-95 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-8">{dictionary.settings.title}</h1>

            <div className="bg-white shadow rounded-lg p-6 space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-primary">{dictionary.settings.personal.title}</h2>
                    <form
                        action={async (formData) => {
                            'use server'
                            await updateProfile(formData)
                        }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">{dictionary.settings.personal.fullName}</label>
                                <input
                                    name="fullName"
                                    defaultValue={profile?.full_name || ''}
                                    className="mt-1 block w-full rounded-md border-muted bg-background px-3 py-2 text-foreground focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">{dictionary.settings.personal.phone}</label>
                                <input
                                    name="phoneNumber"
                                    defaultValue={profile?.phone_number || ''}
                                    className="mt-1 block w-full rounded-md border-muted bg-background px-3 py-2 text-foreground focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{dictionary.settings.personal.email}</label>
                            <input
                                disabled
                                value={user.email || ''}
                                className="mt-1 block w-full rounded-md border-muted bg-muted px-3 py-2 text-muted-foreground italic"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{dictionary.settings.personal.locale}</label>
                            <select
                                name="locale"
                                defaultValue={profile?.locale || 'en'}
                                className="mt-1 block w-full rounded-md border-muted bg-background px-3 py-2 text-foreground focus:ring-primary focus:border-primary"
                            >
                                <option value="en">English (Global)</option>
                                <option value="no">Norwegian (Bokmål)</option>
                                <option value="se">Swedish</option>
                                <option value="da">Danish</option>
                                <option value="fi">Finnish</option>
                                <option value="is">Icelandic</option>
                            </select>
                        </div>

                        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
                            {dictionary.settings.personal.save}
                        </button>
                    </form>
                </section>

                <hr className="border-muted" />

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-destructive">{dictionary.settings.security.title}</h2>
                    <p className="text-muted-foreground mb-4">{dictionary.settings.security.description}</p>
                    <button className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10">
                        {profile?.is_mfa_enabled ? dictionary.settings.security.manage : dictionary.settings.security.activate}
                    </button>
                </section>
            </div>
        </div>
    )
}
