import { useState, useCallback } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import admin from '@/routes/admin/index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import AppLayout from '@/layouts/app/app-sidebar-layout';
import { toast } from 'sonner';

export default function Edit({ project, categories }: { project: any, categories: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: project.title,
        category_id: project.category_id?.toString() || '',
        description: project.description || '',
        client: project.client || '',
        role: project.role || '',
        project_url: project.project_url || '',
        video_url: project.video_url || '',
        completion_date: project.completion_date ? project.completion_date.split('T')[0] : '',
        is_published: project.is_published === 1 || project.is_published === true,
        cover_image: null as File | null,
        images: [] as File[],
    });

    const [coverPreview, setCoverPreview] = useState<string | null>(project.cover_image ? `/storage/${project.cover_image}` : null);
    const [existingGallery, setExistingGallery] = useState(project.images || []);
    const [galleryPreviews, setGalleryPreviews] = useState<{ id: string, url: string }[]>([]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: data.description,
        onUpdate: ({ editor }) => {
            setData('description', editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 border rounded-md bg-white',
            },
        },
    });

    const onDropCover = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setData('cover_image', acceptedFiles[0]);
            setCoverPreview(URL.createObjectURL(acceptedFiles[0]));
        }
    }, []);

    const { getRootProps: getCoverProps, getInputProps: getCoverInput } = useDropzone({
        onDrop: onDropCover,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        maxFiles: 1,
    });

    const onDropGallery = useCallback((acceptedFiles: File[]) => {
        setData('images', [...data.images, ...acceptedFiles]);
        const newPreviews = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            url: URL.createObjectURL(file)
        }));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }, [data.images]);

    const { getRootProps: getGalleryProps, getInputProps: getGalleryInput } = useDropzone({
        onDrop: onDropGallery,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    });

    const removeNewGalleryImage = (index: number) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);

        const newPreviews = [...galleryPreviews];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.projects.update(project.id), {
            onSuccess: () => toast.success('Proyecto actualizado'),
            onError: () => toast.error('Revisa los errores en el formulario'),
        });
    };

    return (
        <>
            <Head title={`Editar Proyecto: ${project.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={admin.projects.index()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Proyecto</h1>
                        <p className="text-muted-foreground">{project.title}</p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información General</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="title">Título del Proyecto</Label>
                                    <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} />
                                    {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <Label>Descripción</Label>
                                    <div className="mt-2 border rounded-md overflow-hidden bg-white">
                                        <EditorContent editor={editor} />
                                    </div>
                                    {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="client">Cliente (Opcional)</Label>
                                        <Input id="client" value={data.client} onChange={e => setData('client', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label htmlFor="role">Rol / Servicios (Opcional)</Label>
                                        <Input id="role" value={data.role} onChange={e => setData('role', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label htmlFor="project_url">Enlace al Proyecto (Opcional)</Label>
                                        <Input id="project_url" type="url" value={data.project_url} onChange={e => setData('project_url', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label htmlFor="completion_date">Fecha de Finalización (Opcional)</Label>
                                        <Input id="completion_date" type="date" value={data.completion_date} onChange={e => setData('completion_date', e.target.value)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Galería del Proyecto</CardTitle>
                                <CardDescription>Sube imágenes adicionales (se añadirán a las existentes).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div {...getGalleryProps()} className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors bg-white">
                                    <input {...getGalleryInput()} />
                                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">Arrastra tus imágenes aquí o haz clic para seleccionar</p>
                                </div>

                                {/* Existing Images */}
                                {existingGallery.length > 0 && (
                                    <div className="mt-6">
                                        <Label>Imágenes Guardadas</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                            {existingGallery.map((img: any) => (
                                                <div key={img.id} className="relative aspect-square rounded-md overflow-hidden border">
                                                    <img src={`/storage/${img.image_path}`} alt="Gallery" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Previews */}
                                {galleryPreviews.length > 0 && (
                                    <div className="mt-6">
                                        <Label>Nuevas Imágenes</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                            {galleryPreviews.map((preview, index) => (
                                                <div key={preview.id} className="relative aspect-square group rounded-md overflow-hidden border">
                                                    <img src={preview.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeNewGalleryImage(index)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organización</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="category_id">Categoría Principal</Label>
                                    <Select value={data.category_id} onValueChange={(val) => setData('category_id', val)}>
                                        <SelectTrigger className="w-full mt-1 bg-white">
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat: any) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-sm text-destructive mt-1">{errors.category_id}</p>}
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <Checkbox id="is_published" checked={data.is_published} onCheckedChange={(checked) => setData('is_published', checked as boolean)} />
                                    <Label htmlFor="is_published" className="font-normal cursor-pointer">
                                        Publicado
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Imagen de Portada</CardTitle>
                                <CardDescription>Sube una nueva si deseas reemplazar la actual.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div {...getCoverProps()} className="border-2 border-dashed rounded-md overflow-hidden bg-muted/20 relative aspect-video cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-center bg-white">
                                    <input {...getCoverInput()} />
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="Portada" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-xs text-muted-foreground">Click o arrastrar imagen</p>
                                        </div>
                                    )}
                                </div>
                                {errors.cover_image && <p className="text-sm text-destructive mt-1">{errors.cover_image}</p>}
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page: any) => {
    const breadcrumbs = [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Proyectos', href: admin.projects.index() },
        { title: 'Editar Proyecto', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
