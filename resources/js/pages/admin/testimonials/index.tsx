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
                        {/* Mobile View (Cards) */}
                        <div className="md:hidden flex flex-col gap-4 mt-4">
                            {testimonials.data.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground border rounded-lg bg-white">
                                    No hay testimonios registrados.
                                </div>
                            ) : (
                                testimonials.data.map((testimonial: any) => (
                                    <div key={testimonial.id} className="flex flex-col p-4 bg-white border rounded-xl shadow-sm gap-4">
                                        <div className="flex justify-between items-start">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${testimonial.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {testimonial.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <div className="shrink-0">
                                                {testimonial.avatar ? (
                                                    <img src={`/storage/${testimonial.avatar}`} className="h-12 w-12 object-cover rounded-full border" alt="avatar" />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border text-[10px] text-muted-foreground">No img</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-lg text-primary">{testimonial.client_name}</span>
                                                <span className="text-sm text-muted-foreground">{testimonial.company || 'Sin empresa'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-3 border-t mt-1">
                                            <Button variant="outline" className="flex-1" asChild>
                                                <Link href={admin.testimonials.edit(testimonial.id)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" className="flex-1" asChild>
                                                <Link href={admin.testimonials.destroy(testimonial.id)} method="delete" as="button" type="button">
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
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Avatar</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Cliente</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Empresa</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Estado</th>
                                        <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 bg-white">
                                    {testimonials.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="h-32 align-middle text-center text-muted-foreground">
                                                No hay testimonios registrados.
                                            </td>
                                        </tr>
                                    )}
                                    {testimonials.data.map((testimonial: any) => (
                                        <tr key={testimonial.id} className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">
                                                {testimonial.avatar ? (
                                                    <img src={`/storage/${testimonial.avatar}`} className="h-10 w-10 object-cover rounded-full border" alt="avatar" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border text-[10px] text-muted-foreground">No img</div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle font-medium text-primary">{testimonial.client_name}</td>
                                            <td className="p-4 align-middle text-muted-foreground">{testimonial.company || '-'}</td>
                                            <td className="p-4 align-middle">
                                                {testimonial.is_active ? (
                                                    <Badge variant="default" className="bg-green-600">Activo</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Inactivo</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle text-right space-x-2">
                                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" asChild>
                                                    <Link href={admin.testimonials.edit(testimonial.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Link href={admin.testimonials.destroy(testimonial.id)} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-destructive h-10 w-10">
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
