import { Head, Link, useForm } from '@inertiajs/react';
import admin from '@/routes/admin/index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app/app-sidebar-layout';
import { toast } from 'sonner';

export default function Edit({ category }: { category: any }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(admin.categories.update(category.id), {
            onSuccess: () => toast.success('Categoría actualizada exitosamente'),
        });
    };

    return (
        <>
            <Head title={`Editar Categoría: ${category.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-2xl">
                
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={admin.categories.index()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Categoría</h1>
                        <p className="text-muted-foreground">{category.name}</p>
                    </div>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Categoría</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="name">Nombre</Label>
                                <Input 
                                    id="name" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    placeholder="Ej. Diseño Editorial"
                                />
                                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page: any) => {
    const breadcrumbs = [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Categorías', href: admin.categories.index() },
        { title: 'Editar Categoría', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
