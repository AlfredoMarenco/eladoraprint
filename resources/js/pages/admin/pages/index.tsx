import { Head, Link } from '@inertiajs/react';
import { create as adminPagesCreate, edit as adminPagesEdit, destroy as adminPagesDestroy } from '@/routes/admin/pages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Index({ pages }: { pages: any }) {
    return (
        <>
            <Head title="Páginas - Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Páginas Dinámicas</h1>
                        <p className="text-muted-foreground">Administra páginas web creadas con el constructor visual.</p>
                    </div>
                    <Button asChild>
                        <Link href={adminPagesCreate()}>
                            <Plus className="mr-2 h-4 w-4" /> Nueva Página
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Páginas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Mobile View (Cards) */}
                        <div className="md:hidden flex flex-col gap-4 mt-4">
                            {pages.data.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground border rounded-lg bg-white">
                                    No hay páginas registradas.
                                </div>
                            ) : (
                                pages.data.map((page: any) => (
                                    <div key={page.id} className="flex flex-col p-4 bg-white border rounded-xl shadow-sm gap-4">
                                        <div className="flex justify-between items-start">
                                            <span className="font-semibold text-lg text-primary truncate">{page.title}</span>
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${page.is_published ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                                                {page.is_published ? 'Publicada' : 'Borrador'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            URL: <span className="font-mono text-xs">/{page.slug}</span>
                                        </div>
                                        <div className="flex gap-2 pt-3 border-t mt-1">
                                            <Button variant="outline" className="flex-1" asChild>
                                                <Link href={adminPagesEdit({ page: page.id })}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Diseñar / Editar
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" className="flex-1" asChild>
                                                <Link href={adminPagesDestroy({ page: page.id })} method="delete" as="button" type="button">
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
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Título</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">URL Slug</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Estado</th>
                                        <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 bg-white">
                                    {pages.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="h-32 align-middle text-center text-muted-foreground">
                                                No hay páginas registradas.
                                            </td>
                                        </tr>
                                    )}
                                    {pages.data.map((page: any) => (
                                        <tr key={page.id} className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle text-muted-foreground">{page.id}</td>
                                            <td className="p-4 align-middle font-medium text-primary">{page.title}</td>
                                            <td className="p-4 align-middle font-mono text-xs text-muted-foreground">/{page.slug}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${page.is_published ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                                                    {page.is_published ? 'Publicada' : 'Borrador'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right space-x-2">
                                                <Button variant="outline" className="hover:bg-primary/10 hover:text-primary" asChild>
                                                    <Link href={adminPagesEdit({ page: page.id })}>
                                                        <Edit className="mr-2 h-4 w-4" /> Diseñar
                                                    </Link>
                                                </Button>
                                                <Link href={adminPagesDestroy({ page: page.id })} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-destructive h-10 w-10">
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

Index.layout = {
    breadcrumbs: [
        {
            title: 'Páginas',
            href: '/admin/pages',
        },
    ],
};
