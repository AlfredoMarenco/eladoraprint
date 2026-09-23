export function TextBlock({ data }: { data: any }) {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="prose prose-lg mx-auto font-sans font-light text-[#1A1A1A]/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.content || '<p>Texto de ejemplo</p>' }} />
            </div>
        </section>
    );
}