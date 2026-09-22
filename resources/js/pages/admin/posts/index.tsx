import { Head, Link } from '@inertiajs/react';
import admin from '@/routes/admin/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app/app-sidebar-layout';

export default function Index({ posts }: { posts: any }) {
    return (
        <>
            <Head title="Blog - Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Artículos del Blog</h1>
                        <p className="text-muted-foreground">Administra las publicaciones de tu blog.</p>
                    </div>
                    <Button asChild>
                        <Link href={admin.posts.create()}>
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Artículo
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Artículos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Mobile View (Cards) */}
                        <div className="md:hidden flex flex-col gap-4 mt-4">
                            {posts.data.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground border rounded-lg bg-white">
                                    No hay publicaciones registradas.
                                </div>
                            ) : (
                                posts.data.map((post: any) => (
                                    <div key={post.id} className="flex flex-col p-4 bg-white border rounded-xl shadow-sm gap-4">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString('es-MX')}</span>
                                            {post.is_published ? (
                                                <Badge variant="default" className="bg-green-600">Publicado</Badge>
                                            ) : (
                                                <Badge variant="secondary">Borrador</Badge>
                                            )}
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <div className="shrink-0">
                                                {post.cover_image ? (
                                                    <img src={`/storage/${post.cover_image}`} alt={post.title} className="w-16 h-16 object-cover rounded-lg border" />
                                                ) : (
                                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border text-xs">N/A</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-lg text-primary line-clamp-2">{post.title}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-3 border-t mt-1">
                                            <Button variant="outline" className="flex-1" asChild>
                                                <Link href={admin.posts.edit(post.id)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" className="flex-1" asChild>
                                                <Link href={admin.posts.destroy(post.id)} method="delete" as="button" type="button">
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
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Portada</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Título</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Estado</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Fecha</th>
                                        <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 bg-white">
                                    {posts.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="h-32 align-middle text-center text-muted-foreground">
                                                No hay publicaciones registradas.
                                            </td>
                                        </tr>
                                    )}
                                    {posts.data.map((post: any) => (
                                        <tr key={post.id} className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">
                                                {post.cover_image ? (
                                                    <img src={`/storage/${post.cover_image}`} alt={post.title} className="w-12 h-12 object-cover rounded-md border" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center border text-[10px]">N/A</div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle font-medium text-primary">{post.title}</td>
                                            <td className="p-4 align-middle">
                                                {post.is_published ? (
                                                    <Badge variant="default" className="bg-green-600">Publicado</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Borrador</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(post.created_at).toLocaleDateString('es-MX')}
                                            </td>
                                            <td className="p-4 align-middle text-right space-x-2">
                                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" asChild>
                                                    <Link href={admin.posts.edit(post.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Link href={admin.posts.destroy(post.id)} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-destructive h-10 w-10">
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
        { title: 'Blog', href: admin.posts.index() },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
