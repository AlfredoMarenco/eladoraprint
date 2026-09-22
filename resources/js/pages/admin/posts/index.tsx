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
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Portada</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Título</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Estado</th>
                                        <th className="h-12 px-4 text-left font-medium text-muted-foreground">Fecha</th>
                                        <th className="h-12 px-4 text-right font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {posts.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 align-middle text-center text-muted-foreground">
                                                No hay artículos registrados.
                                            </td>
                                        </tr>
                                    )}
                                    {posts.data.map((post: any) => (
                                        <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                {post.cover_image ? (
                                                    <img src={`/storage/${post.cover_image}`} className="h-10 w-16 object-cover rounded" alt="cover" />
                                                ) : '-'}
                                            </td>
                                            <td className="p-4 align-middle font-medium">{post.title}</td>
                                            <td className="p-4 align-middle">
                                                {post.is_published ? (
                                                    <Badge variant="default" className="bg-green-600">Publicado</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Borrador</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {new Date(post.created_at).toLocaleDateString('es-MX')}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.posts.edit(post.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Link href={admin.posts.destroy(post.id)} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-destructive hover:text-destructive-foreground h-10 w-10">
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
