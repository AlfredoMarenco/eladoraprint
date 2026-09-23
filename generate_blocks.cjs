const fs = require('fs');
const path = require('path');

const blocks = {
  'TextBlock.tsx': `export function TextBlock({ data }: { data: any }) {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="prose prose-lg mx-auto font-sans font-light text-[#1A1A1A]/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.content || '<p>Texto de ejemplo</p>' }} />
            </div>
        </section>
    );
}`,
  'ImageTextBlock.tsx': `export function ImageTextBlock({ data }: { data: any }) {
    const isLeft = data.alignment !== 'right';
    return (
        <section className="bg-[#FAF7F2] py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className={\`flex flex-col gap-12 items-center \${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}\`}>
                    <div className="w-full lg:w-1/2">
                        {data.image ? (
                            <img src={data.image} alt={data.title} className="w-full h-[500px] object-cover rounded-[2rem] shadow-xl" />
                        ) : (
                            <div className="w-full h-[500px] bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-muted-foreground">Imagen no configurada</div>
                        )}
                    </div>
                    <div className="w-full lg:w-1/2 lg:px-12">
                        {data.title && <h2 className="text-4xl font-serif text-[#1A1A1A] mb-6">{data.title}</h2>}
                        <div className="prose prose-lg font-sans font-light text-[#1A1A1A]/80" dangerouslySetInnerHTML={{ __html: data.text || '<p>Texto descriptivo...</p>' }} />
                    </div>
                </div>
            </div>
        </section>
    );
}`,
  'IconListBlock.tsx': `import { Check } from 'lucide-react';
export function IconListBlock({ data }: { data: any }) {
    const items = Array.isArray(data.items) ? data.items : [];
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item: any, i: number) => (
                        <div key={i} className="flex flex-col items-center text-center p-6 bg-[#FAF7F2] rounded-3xl">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#D4A853] mb-4 shadow-sm">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl text-[#1A1A1A]">{item.text || 'Beneficio'}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}`,
  'ButtonBlock.tsx': `export function ButtonBlock({ data }: { data: any }) {
    const alignmentClass = data.alignment === 'left' ? 'justify-start' : data.alignment === 'right' ? 'justify-end' : 'justify-center';
    return (
        <section className="bg-transparent py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className={\`flex \${alignmentClass}\`}>
                    <a href={data.url || '#'} className="inline-flex h-14 items-center justify-center rounded-full bg-[#1A1A1A] px-10 text-sm font-medium tracking-widest text-white uppercase transition-all hover:bg-[#D4A853]">
                        {data.text || 'Botón'}
                    </a>
                </div>
            </div>
        </section>
    );
}`,
  'CardsBlock.tsx': `export function CardsBlock({ data }: { data: any }) {
    const cards = Array.isArray(data.cards) ? data.cards : [];
    return (
        <section className="bg-white py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card: any, i: number) => (
                        <div key={i} className="bg-[#FAF7F2] rounded-[2rem] overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                            <div className="h-64 bg-white relative">
                                {card.image ? (
                                    <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Imagen de Tarjeta</div>
                                )}
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-serif text-[#1A1A1A] mb-3">{card.title || 'Título Tarjeta'}</h3>
                                <p className="font-sans font-light text-[#1A1A1A]/70 leading-relaxed">{card.text || 'Descripción de la tarjeta'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}`,
  'ImageBlock.tsx': `export function ImageBlock({ data }: { data: any }) {
    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-4 max-w-7xl text-center">
                {data.url ? (
                    <img src={data.url} alt={data.caption || 'Imagen'} className="w-full rounded-[2rem] shadow-xl max-h-[80vh] object-cover mx-auto" />
                ) : (
                    <div className="w-full h-[60vh] bg-[#FAF7F2] rounded-[2rem] flex items-center justify-center text-muted-foreground shadow-inner">Configura la URL de la imagen</div>
                )}
                {data.caption && <p className="mt-4 text-sm font-light italic text-[#1A1A1A]/60">{data.caption}</p>}
            </div>
        </section>
    );
}`,
  'VideoBlock.tsx': `export function VideoBlock({ data }: { data: any }) {
    const getVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const youtubeId = getVideoId(data.url);

    return (
        <section className="bg-[#1A1A1A] py-24">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl">
                    {youtubeId ? (
                        <iframe width="100%" height="100%" src={\`https://www.youtube.com/embed/\${youtubeId}?rel=0\`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/50 text-sm">
                            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Ingresa una URL de YouTube válida
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}`,
  'MapBlock.tsx': `export function MapBlock({ data }: { data: any }) {
    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="w-full h-[500px] bg-slate-100 rounded-[2rem] overflow-hidden shadow-inner">
                    {data.iframe_code ? (
                        <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" dangerouslySetInnerHTML={{ __html: data.iframe_code }} />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-sm">
                            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Pega el iframe de Google Maps aquí
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}`,
  'CarouselBlock.tsx': `export function CarouselBlock({ data }: { data: any }) {
    const images = Array.isArray(data.images) ? data.images : [];
    return (
        <section className="bg-white py-24 overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex gap-4 overflow-x-auto pb-8 snap-x custom-scrollbar">
                    {images.length > 0 ? images.map((img: any, i: number) => (
                        <img key={i} src={img.url || img} className="h-[400px] w-auto object-cover rounded-[2rem] snap-center shadow-lg shrink-0" alt="Carousel item" />
                    )) : (
                        <div className="w-full h-[400px] bg-[#FAF7F2] rounded-[2rem] flex items-center justify-center text-muted-foreground text-sm">Configura el arreglo de imágenes</div>
                    )}
                </div>
            </div>
        </section>
    );
}`,
  'GalleryBlock.tsx': `export function GalleryBlock({ data }: { data: any }) {
    const images = Array.isArray(data.images) ? data.images : [];
    return (
        <section className="bg-white py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.length > 0 ? images.map((img: any, i: number) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                            <img src={img.url || img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Gallery item" />
                        </div>
                    )) : (
                        <div className="col-span-full h-64 bg-[#FAF7F2] rounded-[2rem] flex items-center justify-center text-muted-foreground text-sm">Agrega imágenes a la galería</div>
                    )}
                </div>
            </div>
        </section>
    );
}`,
  'ContactFormBlock.tsx': `import { useState } from 'react';

export function ContactFormBlock({ data }: { data: any }) {
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Enviando...');
        // Mock submission
        setTimeout(() => setStatus('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'), 1000);
    };

    return (
        <section className="bg-[#1A1A1A] py-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(212,168,83,0.8)_0,transparent_50%)]"></div>
            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">{data.title || 'Contáctanos'}</h2>
                        <p className="font-light text-[#1A1A1A]/70">{data.subtitle || 'Déjanos un mensaje y te responderemos a la brevedad.'}</p>
                    </div>
                    {status === '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.' ? (
                        <div className="p-6 bg-green-50 text-green-700 rounded-2xl text-center border border-green-200">
                            {status}
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Nombre</label>
                                    <input required type="text" className="w-full bg-[#FAF7F2] border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4A853] outline-none" placeholder="Tu nombre" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Teléfono</label>
                                    <input required type="tel" className="w-full bg-[#FAF7F2] border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4A853] outline-none" placeholder="Tu teléfono" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Correo Electrónico</label>
                                <input required type="email" className="w-full bg-[#FAF7F2] border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4A853] outline-none" placeholder="tu@correo.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Mensaje</label>
                                <textarea required rows={4} className="w-full bg-[#FAF7F2] border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4A853] outline-none" placeholder="¿En qué te podemos ayudar?"></textarea>
                            </div>
                            <button type="submit" disabled={status === 'Enviando...'} className="w-full h-14 rounded-full bg-[#1A1A1A] text-white font-medium tracking-widest uppercase hover:bg-[#D4A853] transition-colors disabled:opacity-50">
                                {status || 'Enviar Mensaje'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}`,
  'DownloadBlock.tsx': `export function DownloadBlock({ data }: { data: any }) {
    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="bg-[#FAF7F2] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#1A1A1A]/5 hover:border-[#D4A853]/30 transition-colors">
                    <div className="flex items-center gap-6 text-center sm:text-left">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#D4A853] shadow-sm shrink-0">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div>
                            <h3 className="font-serif text-2xl text-[#1A1A1A]">{data.title || 'Documento Descargable'}</h3>
                            <p className="text-sm font-light text-[#1A1A1A]/60 mt-1">Archivo / PDF</p>
                        </div>
                    </div>
                    <a href={data.file_url || '#'} download className="inline-flex h-12 items-center justify-center rounded-full bg-white border border-[#1A1A1A] px-8 text-sm font-medium tracking-wider text-[#1A1A1A] uppercase transition-all hover:bg-[#1A1A1A] hover:text-white shrink-0">
                        Descargar
                    </a>
                </div>
            </div>
        </section>
    );
}`,
  'EmbedBlock.tsx': `export function EmbedBlock({ data }: { data: any }) {
    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {data.code ? (
                    <div dangerouslySetInnerHTML={{ __html: data.code }} />
                ) : (
                    <div className="w-full p-12 bg-[#FAF7F2] border-2 border-dashed border-[#1A1A1A]/20 rounded-[2rem] flex flex-col items-center justify-center text-[#1A1A1A]/50 text-center">
                        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                        Bloque Embebido: Pega tu código HTML en la configuración.
                    </div>
                )}
            </div>
        </section>
    );
}`
};

const componentsDir = path.join(__dirname, 'resources/js/components/blocks');

Object.entries(blocks).forEach(([filename, code]) => {
  fs.writeFileSync(path.join(componentsDir, filename), code);
  console.log('Created ' + filename);
});
