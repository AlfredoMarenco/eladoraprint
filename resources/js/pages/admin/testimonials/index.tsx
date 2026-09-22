import { Head, Link } from '@inertiajs/react';
import admin from '@/routes/admin/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app/app-sidebar-layout';

export default function Index({ testimonials }: { testimonials: any }) {
    return (
        <>
            <Head title="Testimonios - Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Testimonios</h1>
                        <p className="text-muted-foreground">Administra las opiniones de tus clientes.</p>
                    </div>
                    <Button asChild>
                        <Link href={admin.testimonials.create()}>
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Testimonio
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Testimonios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Avatar</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Cliente</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Empresa</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Estado</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {testimonials.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 align-middle text-center text-muted-foreground">
                                                No hay testimonios registrados.
                                            </td>
                                        </tr>
                                    )}
                                    {testimonials.data.map((testimonial: any) => (
                                        <tr key={testimonial.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                {testimonial.avatar_image ? (
                                                    <img src={`/storage/${testimonial.avatar_image}`} className="h-10 w-10 object-cover rounded-full" alt="avatar" />
                                                ) : '-'}
                                            </td>
                                            <td className="p-4 align-middle font-medium">{testimonial.client_name}</td>
                                            <td className="p-4 align-middle">{testimonial.company || '-'}</td>
                                            <td className="p-4 align-middle">
                                                {testimonial.is_active ? (
                                                    <Badge variant="default" className="bg-green-600">Activo</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Inactivo</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.testimonials.edit(testimonial.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Link href={admin.testimonials.destroy(testimonial.id)} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-destructive hover:text-destructive-foreground h-10 w-10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Index.layout = (page: any) => {
    const breadcrumbs = [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Testimonios', href: admin.testimonials.index() },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
