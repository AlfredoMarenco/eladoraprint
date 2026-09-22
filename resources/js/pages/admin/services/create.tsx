import { Head, Link, useForm } from '@inertiajs/react';
import admin from '@/routes/admin/index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app/app-sidebar-layout';
import { toast } from 'sonner';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        order: '0',
        icon_path: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.services.store(), {
            onSuccess: () => toast.success('Servicio creado exitosamente'),
        });
    };

    return (
        <>
            <Head title="Crear Servicio" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-2xl">
                
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={admin.services.index()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Nuevo Servicio</h1>
                        <p className="text-muted-foreground">Añade un servicio que ofreces.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Servicio</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input 
                                    id="title" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                />
                                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea 
                                    id="description" 
                                    value={data.description} 
                                    onChange={e => setData('description', e.target.value)} 
                                />
                                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="order">Orden (Prioridad visual)</Label>
                                <Input 
                                    id="order" 
                                    type="number"
                                    value={data.order} 
                                    onChange={e => setData('order', e.target.value)} 
                                />
                                {errors.order && <p className="text-sm text-destructive mt-1">{errors.order}</p>}
                            </div>

                            <div>
                                <Label htmlFor="icon_path">Ícono (Imagen o SVG)</Label>
                                <Input 
                                    id="icon_path" 
                                    type="file"
                                    onChange={e => setData('icon_path', e.target.files ? e.target.files[0] : null)} 
                                />
                                {errors.icon_path && <p className="text-sm text-destructive mt-1">{errors.icon_path}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Guardando...' : 'Guardar Servicio'}
                    </Button>
                </form>
            </div>
        </>
    );
}

Create.layout = (page: any) => {
    const breadcrumbs = [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Servicios', href: admin.services.index() },
        { title: 'Crear Servicio', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
