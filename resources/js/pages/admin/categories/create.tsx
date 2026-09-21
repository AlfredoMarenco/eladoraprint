import { Head, Link, useForm } from '@inertiajs/react';
import { index as adminCategoriesIndex, store as adminCategoriesStore } from '@/routes/admin/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(adminCategoriesStore());
    };

    return (
        <>
            <Head title="Crear Categoría - Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={adminCategoriesIndex()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Nueva Categoría</h1>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="description">Descripción (Opcional)</Label>
                                <Input id="description" value={data.description} onChange={e => setData('description', e.target.value)} />
                                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                            </div>
                            <Button type="submit" disabled={processing} className="mt-4">
                                {processing ? 'Guardando...' : 'Guardar Categoría'}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}
