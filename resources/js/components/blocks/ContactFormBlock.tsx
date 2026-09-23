import { useState } from 'react';

export function ContactFormBlock({ data }: { data: any }) {
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Enviando...');
        // Mock submission
        setTimeout(() => setStatus('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'), 1000);
    };

    return (
        <section className="bg-[#1A1A1A] py-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(212,168,83,0.8)_0,transparent_50%)]"></div>
            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">{data.title || 'Contáctanos'}</h2>
                        <p className="font-light text-[#1A1A1A]/70">{data.subtitle || 'Déjanos un mensaje y te responderemos a la brevedad.'}</p>
                    </div>
                    {status === '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.' ? (
                        <div className="p-6 bg-green-50 text-green-700 rounded-2xl text-center border border-green-200">
                            {status}
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Nombre</label>
                                    <input required type="text" className="w-full bg-[#FAF7F2] border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4A853] outline-none" placeholder="Tu nombre" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Teléfono</label>
                                    <input required type="tel" className="w-full bg-[#FAF7F2] border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4A853] outline-none" placeholder="Tu teléfono" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Correo Electrónico</label>
                                <input required type="email" className="w-full bg-[#FAF7F2] border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4A853] outline-none" placeholder="tu@correo.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Mensaje</label>
                                <textarea required rows={4} className="w-full bg-[#FAF7F2] border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4A853] outline-none" placeholder="¿En qué te podemos ayudar?"></textarea>
                            </div>
                            <button type="submit" disabled={status === 'Enviando...'} className="w-full h-14 rounded-full bg-[#1A1A1A] text-white font-medium tracking-widest uppercase hover:bg-[#D4A853] transition-colors disabled:opacity-50">
                                {status || 'Enviar Mensaje'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}