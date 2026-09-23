export function ImageBlock({ data }: { data: any }) {
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
}