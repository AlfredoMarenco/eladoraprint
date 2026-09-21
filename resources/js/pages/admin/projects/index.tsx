import { Head, Link } from '@inertiajs/react';
import { create as adminProjectsCreate, edit as adminProjectsEdit, destroy as adminProjectsDestroy } from '@/routes/admin/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// Note: We need to ensure table components exist. I will use standard html tables if they don't, but I can assume basic html tables wrapped in classes for now if Shadcn doesn't have it.

export default function Index({ projects }: { projects: any }) {
    return (
        <>
            <Head title="Proyectos - Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Proyectos</h1>
                        <p className="text-muted-foreground">Administra tu portafolio de proyectos.</p>
                    </div>
                    <Button asChild>
                        <Link href={adminProjectsCreate()}>
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Proyectos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Imagen</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Título</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoría</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {projects.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 align-middle text-center text-muted-foreground">
                                                No hay proyectos registrados.
                                            </td>
                                        </tr>
                                    )}
                                    {projects.data.map((project: any) => (
                                        <tr key={project.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">{project.id}</td>
                                            <td className="p-4 align-middle">
                                                {project.cover_image ? (
                                                    <img src={`/storage/${project.cover_image}`} alt={project.title} className="w-12 h-12 object-cover rounded-md" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">N/A</div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle font-medium">{project.title}</td>
                                            <td className="p-4 align-middle">{project.category?.name || 'N/A'}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${project.is_published ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                                                    {project.is_published ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={adminProjectsEdit({ project: project.id })}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Link href={adminProjectsDestroy({ project: project.id })} method="delete" as="button" type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-10 w-10">
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
            title: 'Proyectos',
            href: '/admin/projects',
        },
    ],
};
