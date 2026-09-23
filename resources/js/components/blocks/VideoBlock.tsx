export function VideoBlock({ data }: { data: any }) {
    const getVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const youtubeId = getVideoId(data.url);

    return (
        <section className="bg-[#1A1A1A] py-24">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl">
                    {youtubeId ? (
                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}?rel=0`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/50 text-sm">
                            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Ingresa una URL de YouTube válida
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}