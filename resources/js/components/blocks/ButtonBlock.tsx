export function ButtonBlock({ data }: { data: any }) {
    const alignmentClass = data.alignment === 'left' ? 'justify-start' : data.alignment === 'right' ? 'justify-end' : 'justify-center';
    return (
        <section className="bg-transparent py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className={`flex ${alignmentClass}`}>
                    <a href={data.url || '#'} className="inline-flex h-14 items-center justify-center rounded-full bg-[#1A1A1A] px-10 text-sm font-medium tracking-widest text-white uppercase transition-all hover:bg-[#D4A853]">
                        {data.text || 'Botón'}
                    </a>
                </div>
            </div>
        </section>
    );
}