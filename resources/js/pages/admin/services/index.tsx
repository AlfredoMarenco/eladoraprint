import { Head, Link } from '@inertiajs/react';
import admin from '@/routes/admin/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app/app-sidebar-layout';

export default function Index({ services }: { services: any }) {
    return (
        <>
            <Head title="Servicios - Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Servicios</h1>
                        <p className="text-muted-foreground">Administra los servicios que ofreces.</p>
                    </div>
                    <Button asChild>
                        <Link href={admin.services.create()}>
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Servicios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Orden</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Ícono</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Título</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {services.data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-4 align-middle text-center text-muted-foreground">
                                                No hay servicios registrados.
                                            </td>
                                        </tr>
                                    )}
                                    {services.data.map((service: any) => (
                                        <tr key={service.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">{service.order}</td>
                                            <td className="p-4 align-middle">
                                                {service.icon_path ? (
                                                    <img src={`/storage/${service.icon_path}`} className="h-10 w-10 object-cover rounded" alt="icono" />
                                                ) : '-'}
                                            </td>
                                            <td className="p-4 align-middle font-medium">{service.title}</td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.services.edit(service.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Link href={admin.services.destroy(service.id)} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-10 w-10">
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
        { title: 'Servicios', href: admin.services.index() },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
