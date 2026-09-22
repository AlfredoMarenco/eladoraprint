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
                        {/* Mobile View (Cards) */}
                        <div className="md:hidden flex flex-col gap-4 mt-4">
                            {services.data.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground border rounded-lg bg-white">
                                    No hay servicios registrados.
                                </div>
                            ) : (
                                services.data.map((service: any) => (
                                    <div key={service.id} className="flex flex-col p-4 bg-white border rounded-xl shadow-sm gap-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="shrink-0 flex flex-col items-center">
                                                <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Orden</span>
                                                <span className="font-bold text-lg text-primary">{service.order}</span>
                                            </div>
                                            <div className="w-[1px] h-10 bg-border"></div>
                                            <div className="shrink-0">
                                                {service.icon_path ? (
                                                    <img src={`/storage/${service.icon_path}`} className="h-10 w-10 object-cover rounded-md border" alt="icono" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border text-[10px] text-muted-foreground">No img</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-lg text-primary">{service.title}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-3 border-t mt-1">
                                            <Button variant="outline" className="flex-1" asChild>
                                                <Link href={admin.services.edit(service.id)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" className="flex-1" asChild>
                                                <Link href={admin.services.destroy(service.id)} method="delete" as="button" type="button">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop View (Table) */}
                        <div className="hidden md:block relative w-full overflow-auto rounded-md border mt-4">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b bg-muted/50">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Orden</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Ícono</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Título</th>
                                        <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 bg-white">
                                    {services.data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="h-32 align-middle text-center text-muted-foreground">
                                                No hay servicios registrados.
                                            </td>
                                        </tr>
                                    )}
                                    {services.data.map((service: any) => (
                                        <tr key={service.id} className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle text-muted-foreground font-medium">{service.order}</td>
                                            <td className="p-4 align-middle">
                                                {service.icon_path ? (
                                                    <img src={`/storage/${service.icon_path}`} className="h-10 w-10 object-cover rounded-md border" alt="icono" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border text-[10px] text-muted-foreground">No img</div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle font-medium text-primary">{service.title}</td>
                                            <td className="p-4 align-middle text-right space-x-2">
                                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" asChild>
                                                    <Link href={admin.services.edit(service.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Link href={admin.services.destroy(service.id)} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-destructive h-10 w-10">
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
