import { Check } from 'lucide-react';
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
}