export function CarouselBlock({ data }: { data: any }) {
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
}