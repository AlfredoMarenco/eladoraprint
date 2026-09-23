export function ImageTextBlock({ data }: { data: any }) {
    const isLeft = data.alignment !== 'right';
    return (
        <section className="bg-[#FAF7F2] py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className={`flex flex-col gap-12 items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
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
}