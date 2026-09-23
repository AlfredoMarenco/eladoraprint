export function GalleryBlock({ data }: { data: any }) {
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
}