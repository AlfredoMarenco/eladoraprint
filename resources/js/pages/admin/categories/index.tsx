import { Head, Link } from '@inertiajs/react';
import { create as adminCategoriesCreate, edit as adminCategoriesEdit, destroy as adminCategoriesDestroy } from '@/routes/admin/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Index({ categories }: { categories: any }) {
    return (
        <>
            <Head title="Categorías - Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Categorías</h1>
                        <p className="text-muted-foreground">Administra las categorías de tus proyectos.</p>
                    </div>
                    <Button asChild>
                        <Link href={adminCategoriesCreate()}>
                            <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Categorías</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Proyectos</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {categories.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 align-middle text-center text-muted-foreground">
                                                No hay categorías registradas.
                                            </td>
                                        </tr>
                                    )}
                                    {categories.data.map((category: any) => (
                                        <tr key={category.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">{category.id}</td>
                                            <td className="p-4 align-middle font-medium">{category.name}</td>
                                            <td className="p-4 align-middle">{category.slug}</td>
                                            <td className="p-4 align-middle">{category.projects_count || 0}</td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={adminCategoriesEdit({ category: category.id })}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Link href={adminCategoriesDestroy({ category: category.id })} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-10 w-10">
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
