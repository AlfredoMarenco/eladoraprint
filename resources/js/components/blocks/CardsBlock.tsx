export function CardsBlock({ data }: { data: any }) {
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
}