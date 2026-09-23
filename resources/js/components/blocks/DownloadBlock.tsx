export function DownloadBlock({ data }: { data: any }) {
    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="bg-[#FAF7F2] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#1A1A1A]/5 hover:border-[#D4A853]/30 transition-colors">
                    <div className="flex items-center gap-6 text-center sm:text-left">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#D4A853] shadow-sm shrink-0">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div>
                            <h3 className="font-serif text-2xl text-[#1A1A1A]">{data.title || 'Documento Descargable'}</h3>
                            <p className="text-sm font-light text-[#1A1A1A]/60 mt-1">Archivo / PDF</p>
                        </div>
                    </div>
                    <a href={data.file_url || '#'} download className="inline-flex h-12 items-center justify-center rounded-full bg-white border border-[#1A1A1A] px-8 text-sm font-medium tracking-wider text-[#1A1A1A] uppercase transition-all hover:bg-[#1A1A1A] hover:text-white shrink-0">
                        Descargar
                    </a>
                </div>
            </div>
        </section>
    );
}