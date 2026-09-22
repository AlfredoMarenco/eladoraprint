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
                        {/* Mobile View (Cards) */}
                        <div className="md:hidden flex flex-col gap-4 mt-4">
                            {categories.data.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground border rounded-lg bg-white">
                                    No hay categorías registradas.
                                </div>
                            ) : (
                                categories.data.map((category: any) => (
                                    <div key={category.id} className="flex flex-col p-4 bg-white border rounded-xl shadow-sm gap-4">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs text-muted-foreground font-mono">ID: {category.id}</span>
                                            <span className="text-xs text-muted-foreground">/{category.slug}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-lg text-primary">{category.name}</span>
                                            <span className="text-sm text-muted-foreground mt-1 line-clamp-2">{category.description || 'Sin descripción'}</span>
                                        </div>
                                        <div className="flex gap-2 pt-3 border-t mt-1">
                                            <Button variant="outline" className="flex-1" asChild>
                                                <Link href={adminCategoriesEdit({ category: category.id })}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" className="flex-1" asChild>
                                                <Link href={adminCategoriesDestroy({ category: category.id })} method="delete" as="button" type="button">
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
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Nombre</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Slug</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Descripción</th>
                                        <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 bg-white">
                                    {categories.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="h-32 align-middle text-center text-muted-foreground">
                                                No hay categorías registradas.
                                            </td>
                                        </tr>
                                    )}
                                    {categories.data.map((category: any) => (
                                        <tr key={category.id} className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle text-muted-foreground">{category.id}</td>
                                            <td className="p-4 align-middle font-medium text-primary">{category.name}</td>
                                            <td className="p-4 align-middle text-muted-foreground">{category.slug}</td>
                                            <td className="p-4 align-middle max-w-[300px] truncate">{category.description || '-'}</td>
                                            <td className="p-4 align-middle text-right space-x-2">
                                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" asChild>
                                                    <Link href={adminCategoriesEdit({ category: category.id })}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Link href={adminCategoriesDestroy({ category: category.id })} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-destructive h-10 w-10">
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
