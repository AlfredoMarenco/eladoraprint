import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { index as adminPagesIndex, update as adminPagesUpdate } from '@/routes/admin/pages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, LayoutTemplate, Settings } from 'lucide-react';

export default function Edit({ page }: { page: any }) {
    const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');

    const { data, setData, put, processing, errors } = useForm({
        title: page.title,
        slug: page.slug,
        seo_description: page.seo_description || '',
        is_published: page.is_published,
        content: page.content || {},
    });

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(adminPagesUpdate({ page: page.id }));
    };

    const updateContent = (field: string, value: string) => {
        setData('content', {
            ...data.content,
            [field]: value
        });
    };

    return (
        <>
            <Head title={`Editar: ${page.title} - Admin`} />
            
            <div className="flex h-full flex-1 flex-col p-2 md:p-6 bg-muted/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={adminPagesIndex()}><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight text-primary truncate max-w-[200px] sm:max-w-md">
                            {page.title}
                        </h1>
                    </div>
                    
                    <div className="flex bg-white rounded-lg border p-1">
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'content' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            <LayoutTemplate className="w-4 h-4 mr-2" />
                            Contenido
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            <Settings className="w-4 h-4 mr-2 hidden sm:block" />
                            Ajustes
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto w-full mt-6">
                    {activeTab === 'settings' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Ajustes de la Página</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Título de la Página</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                        />
                                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug (URL)</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                        />
                                        {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="seo_description">Descripción SEO</Label>
                                        <Textarea
                                            id="seo_description"
                                            value={data.seo_description}
                                            onChange={(e) => setData('seo_description', e.target.value)}
                                        />
                                        {errors.seo_description && <p className="text-sm text-destructive">{errors.seo_description}</p>}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_published"
                                            checked={data.is_published}
                                            onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                                        />
                                        <Label htmlFor="is_published">Publicada</Label>
                                    </div>
                                    {errors.is_published && <p className="text-sm text-destructive">{errors.is_published}</p>}

                                    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                        <Save className="w-4 h-4 mr-2" /> Guardar Ajustes
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'content' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Editar Contenido</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSettingsSubmit} className="space-y-8">
                                    {data.slug === 'home' ? (
                                        <>
                                            {/* Sección Hero */}
                                            <div className="space-y-4 border-b pb-6">
                                                <h3 className="text-lg font-semibold text-primary">Sección Principal (Hero)</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Línea 1 (Itálica Dorada)</Label>
                                                        <Input value={data.content.hero_title_1 || ''} onChange={(e) => updateContent('hero_title_1', e.target.value)} placeholder="Diseño, papel y experiencias" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Línea 2 (Negrita)</Label>
                                                        <Input value={data.content.hero_title_2 || ''} onChange={(e) => updateContent('hero_title_2', e.target.value)} placeholder="creadas" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Línea 3 (Negrita)</Label>
                                                        <Input value={data.content.hero_title_3 || ''} onChange={(e) => updateContent('hero_title_3', e.target.value)} placeholder="para hacer especiales" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Línea 4 (Itálica Dorada)</Label>
                                                        <Input value={data.content.hero_title_4 || ''} onChange={(e) => updateContent('hero_title_4', e.target.value)} placeholder="tus ideas." />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <Label>Subtítulo 1</Label>
                                                    <Input value={data.content.hero_subtitle_1 || ''} onChange={(e) => updateContent('hero_subtitle_1', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Subtítulo 2</Label>
                                                    <Textarea value={data.content.hero_subtitle_2 || ''} onChange={(e) => updateContent('hero_subtitle_2', e.target.value)} />
                                                </div>
                                            </div>

                                            {/* Universo Eladora */}
                                            <div className="space-y-4 border-b pb-6">
                                                <h3 className="text-lg font-semibold text-primary">Sección: Universo Eladora</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Título (Parte 1)</Label>
                                                        <Input value={data.content.about_title_1 || ''} onChange={(e) => updateContent('about_title_1', e.target.value)} placeholder="Universo" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Título (Parte 2)</Label>
                                                        <Input value={data.content.about_title_2 || ''} onChange={(e) => updateContent('about_title_2', e.target.value)} placeholder="Eladora" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <Label>Texto descriptivo</Label>
                                                    <Textarea value={data.content.about_text || ''} onChange={(e) => updateContent('about_text', e.target.value)} className="h-32" />
                                                </div>
                                            </div>

                                            {/* Fundadora */}
                                            <div className="space-y-4 pb-6">
                                                <h3 className="text-lg font-semibold text-primary">Sección: Fundadora</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Nombre (Itálica)</Label>
                                                        <Input value={data.content.founder_name_1 || ''} onChange={(e) => updateContent('founder_name_1', e.target.value)} placeholder="Daniela" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Apellido (Negrita)</Label>
                                                        <Input value={data.content.founder_name_2 || ''} onChange={(e) => updateContent('founder_name_2', e.target.value)} placeholder="Eloísa" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Rol / Puesto</Label>
                                                        <Input value={data.content.founder_role || ''} onChange={(e) => updateContent('founder_role', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <Label>Mensaje (Párrafo 1)</Label>
                                                    <Textarea value={data.content.founder_text_1 || ''} onChange={(e) => updateContent('founder_text_1', e.target.value)} className="h-24" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Mensaje (Párrafo 2)</Label>
                                                    <Textarea value={data.content.founder_text_2 || ''} onChange={(e) => updateContent('founder_text_2', e.target.value)} className="h-24" />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>Actualmente solo la página "Inicio" tiene campos predefinidos editables aquí.</p>
                                        </div>
                                    )}

                                    <Button type="submit" disabled={processing} className="w-full">
                                        <Save className="w-4 h-4 mr-2" /> Guardar Contenido
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Páginas',
            href: '/admin/pages',
        },
        {
            title: 'Editar',
            href: '#',
        },
    ],
};
