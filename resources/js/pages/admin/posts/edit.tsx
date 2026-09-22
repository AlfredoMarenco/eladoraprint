import { useState, useCallback } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import admin from '@/routes/admin/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import AppLayout from '@/layouts/app/app-sidebar-layout';
import { toast } from 'sonner';

export default function Edit({ post: blogPost }: { post: any }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: blogPost.title,
        excerpt: blogPost.excerpt || '',
        content: blogPost.content || '',
        is_published: blogPost.is_published,
        cover_image: null as File | null,
    });

    const [coverPreview, setCoverPreview] = useState<string | null>(blogPost.cover_image ? `/storage/${blogPost.cover_image}` : null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: data.content,
        onUpdate: ({ editor }) => {
            setData('content', editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 border rounded-md bg-white',
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.posts.update(blogPost.id), {
            onSuccess: () => toast.success('Artículo actualizado exitosamente'),
        });
    };

    return (
        <>
            <Head title={`Editar Artículo: ${blogPost.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={admin.posts.index()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Artículo</h1>
                        <p className="text-muted-foreground">{blogPost.title}</p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contenido del Artículo</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="title">Título</Label>
                                    <Input 
                                        id="title" 
                                        value={data.title} 
                                        onChange={e => setData('title', e.target.value)} 
                                    />
                                    {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="excerpt">Resumen (Excerpt)</Label>
                                    <Textarea 
                                        id="excerpt" 
                                        value={data.excerpt} 
                                        onChange={e => setData('excerpt', e.target.value)} 
                                    />
                                    {errors.excerpt && <p className="text-sm text-destructive mt-1">{errors.excerpt}</p>}
                                </div>

                                <div>
                                    <Label>Contenido Completo</Label>
                                    <div className="mt-2 border rounded-md overflow-hidden bg-white">
                                        <EditorContent editor={editor} />
                                    </div>
                                    {errors.content && <p className="text-sm text-destructive mt-1">{errors.content}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organización</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="is_published" 
                                        checked={data.is_published} 
                                        onCheckedChange={(checked) => setData('is_published', checked as boolean)} 
                                    />
                                    <Label htmlFor="is_published" className="font-normal cursor-pointer">
                                        Publicado
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Imagen de Portada</CardTitle>
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
        { title: 'Blog', href: admin.posts.index() },
        { title: 'Editar Artículo', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
