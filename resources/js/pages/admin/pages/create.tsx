import { Head, useForm, Link } from '@inertiajs/react';
import { index as adminPagesIndex, store as adminPagesStore } from '@/routes/admin/pages';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        seo_description: '',
        is_published: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(adminPagesStore());
    };

    return (
        <>
            <Head title="Nueva Página - Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Nueva Página</h1>
                        <p className="text-muted-foreground">Crea una página antes de diseñarla.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={adminPagesIndex()}>Cancelar</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalles de la Página</CardTitle>
                        <CardDescription>La configuración inicial de la página. Podrás diseñar su contenido visual más adelante.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título de la Página</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Ej. Sobre Nosotros"
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
                                    placeholder="ej. sobre-nosotros (Se generará automáticamente si lo dejas en blanco)"
                                />
                                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seo_description">Descripción SEO (Opcional)</Label>
                                <Textarea
                                    id="seo_description"
                                    value={data.seo_description}
                                    onChange={(e) => setData('seo_description', e.target.value)}
                                    placeholder="Breve descripción para los motores de búsqueda..."
                                />
                                {errors.seo_description && <p className="text-sm text-destructive">{errors.seo_description}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_published"
                                    checked={data.is_published}
                                    onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                                />
                                <Label htmlFor="is_published">Publicar página (Hacer visible al público)</Label>
                            </div>
                            {errors.is_published && <p className="text-sm text-destructive">{errors.is_published}</p>}

                            <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                Crear Página y Continuar al Diseño
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Páginas',
            href: '/admin/pages',
        },
        {
            title: 'Nueva',
            href: '#',
        },
    ],
};
