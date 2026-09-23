export function MapBlock({ data }: { data: any }) {
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
}