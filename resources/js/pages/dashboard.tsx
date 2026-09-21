import { Head } from '@inertiajs/react';
import { dashboard as adminDashboard } from '@/routes/admin/index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Image, FileText, Briefcase, MessageSquare } from 'lucide-react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard - Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Bienvenida de nuevo</h1>
                    <p className="text-muted-foreground">Aquí tienes un resumen del contenido de tu portafolio.</p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Proyectos Publicados</CardTitle>
                            <Image className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Obras en el portafolio</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Artículos del Blog</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Entradas publicadas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Servicios Ofrecidos</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Servicios activos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Testimonios</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Clientes felices</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="h-[400px]">
                        <CardHeader>
                            <CardTitle>Actividad Reciente</CardTitle>
                            <CardDescription>Tus últimos proyectos subidos aparecerán aquí.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex h-[300px] items-center justify-center border-t border-border/50 bg-muted/20">
                            <p className="text-sm text-muted-foreground">Aún no hay actividad.</p>
                        </CardContent>
                    </Card>
                    <Card className="h-[400px]">
                        <CardHeader>
                            <CardTitle>Accesos Rápidos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <a href="/admin/projects/create" className="text-primary hover:underline">Subir un nuevo proyecto</a>
                            <a href="/admin/posts/create" className="text-primary hover:underline">Escribir entrada de blog</a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: adminDashboard(),
        },
    ],
};
