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
import AppLayout from '@/layouts/app/app-sidebar-layout';
import { toast } from 'sonner';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        company: '',
        content: '',
        is_active: true,
        avatar_image: null as File | null,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const onDropAvatar = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setData('avatar_image', acceptedFiles[0]);
            setAvatarPreview(URL.createObjectURL(acceptedFiles[0]));
        }
    }, []);

    const { getRootProps: getAvatarProps, getInputProps: getAvatarInput } = useDropzone({
        onDrop: onDropAvatar,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        maxFiles: 1,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.testimonials.store(), {
            onSuccess: () => toast.success('Testimonio creado exitosamente'),
        });
    };

    return (
        <>
            <Head title="Crear Testimonio" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={admin.testimonials.index()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Nuevo Testimonio</h1>
                        <p className="text-muted-foreground">Añade la opinión de un cliente.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Testimonio</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="client_name">Nombre del Cliente</Label>
                                    <Input 
                                        id="client_name" 
                                        value={data.client_name} 
                                        onChange={e => setData('client_name', e.target.value)} 
                                    />
                                    {errors.client_name && <p className="text-sm text-destructive mt-1">{errors.client_name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="company">Empresa / Cargo (Opcional)</Label>
                                    <Input 
                                        id="company" 
                                        value={data.company} 
                                        onChange={e => setData('company', e.target.value)} 
                                    />
                                    {errors.company && <p className="text-sm text-destructive mt-1">{errors.company}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="content">Testimonio</Label>
                                    <Textarea 
                                        id="content" 
                                        rows={5}
                                        value={data.content} 
                                        onChange={e => setData('content', e.target.value)} 
                                    />
                                    {errors.content && <p className="text-sm text-destructive mt-1">{errors.content}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Estado</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="is_active" 
                                        checked={data.is_active} 
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)} 
                                    />
                                    <Label htmlFor="is_active" className="font-normal cursor-pointer">
                                        Testimonio Activo (Visible en la web)
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Avatar del Cliente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div {...getAvatarProps()} className="border-2 border-dashed rounded-md overflow-hidden bg-muted/20 relative aspect-square cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-center bg-white max-w-[200px] mx-auto rounded-full">
                                    <input {...getAvatarInput()} />
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-xs text-muted-foreground">Click/Arrastrar</p>
                                        </div>
                                    )}
                                </div>
                                {errors.avatar_image && <p className="text-sm text-destructive mt-1 text-center">{errors.avatar_image}</p>}
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Guardando...' : 'Guardar Testimonio'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page: any) => {
    const breadcrumbs = [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Testimonios', href: admin.testimonials.index() },
        { title: 'Crear Testimonio', href: '#' },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
