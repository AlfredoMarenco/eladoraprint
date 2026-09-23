export function EmbedBlock({ data }: { data: any }) {
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
}