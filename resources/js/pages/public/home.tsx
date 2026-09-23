import { Head, Link } from '@inertiajs/react';
import { 
  Printer, 
  PartyPopper, 
  MonitorSmartphone, 
  MessageCircle, 
  CheckCircle2, 
  Lightbulb, 
  Star,
  FileHeart
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon'; // Assuming this provides the logo

export default function Home({ page }: any) {
    const content = page?.content || {};

    // Defaults in case DB is empty
    const heroTitle1 = content.hero_title_1 || 'Diseño, papel y experiencias';
    const heroTitle2 = content.hero_title_2 || 'creadas';
    const heroTitle3 = content.hero_title_3 || 'para hacer especiales';
    const heroTitle4 = content.hero_title_4 || 'tus ideas.';
    const heroSub1 = content.hero_subtitle_1 || 'Imprenta Boutique y Diseño Gráfico Premium.';
    const heroSub2 = content.hero_subtitle_2 || 'Transformamos tus ideas en piezas tangibles y memorables que exigen destacar.';
    
    const aboutTitle1 = content.about_title_1 || 'Universo';
    const aboutTitle2 = content.about_title_2 || 'Eladora';
    const aboutText = content.about_text || 'Texto o párrafo que explica como se confirma eladora, los servicios como se clasifican y qué se hace en cada uno. Para explicar porqué son 3 conceptos diferentes y todo lo que abarcamos.';
    
    const founderName1 = content.founder_name_1 || 'Daniela';
    const founderName2 = content.founder_name_2 || 'Eloísa';
    const founderRole = content.founder_role || 'Diseñadora gráfica y mente creativa';
    const founderText1 = content.founder_text_1 || 'Hola! Soy la creadora y fundadora del universo Eladora, soy una apasionada por el diseño y la textura de lo tangible. En un mundo digital, el papel sigue teniendo el poder de crear conexiones genuinas.';
    const founderText2 = content.founder_text_2 || 'Mi enfoque es artesanal y detallista. Cada proyecto que pasa por mis manos es tratado como una obra única. Desde papelería fina hasta empaques que enamoran desde el primer vistazo.';

    return (
        <div className="font-sans text-[#1A1A1A] antialiased">
            <Head title={page?.title || 'Inicio'} />
            
            {/* Navbar */}
            <nav className="absolute top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-2 mb-4 md:mb-0 text-[#C8A232]">
                        <div className="w-8 h-8">
                            {/* Crown / Flower Emblem Placeholder */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0l-5 5m5-5l5 5m-5-13a3 3 0 100 6 3 3 0 000-6z" />
                            </svg>
                        </div>
                        <span className="font-medium tracking-wide text-xl lowercase">eladora</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-[#C8A232] font-medium tracking-wide">
                        <Link href="/" className="hover:text-stone-900 transition-colors">Inicio</Link>
                        <Link href="/servicios" className="hover:text-stone-900 transition-colors">Servicios</Link>
                        <Link href="/catalogo" className="hover:text-stone-900 transition-colors">Catálogo</Link>
                        <Link href="/tienda" className="hover:text-stone-900 transition-colors">Tienda</Link>
                        <Link href="/nosotros" className="hover:text-stone-900 transition-colors">Nosotros</Link>
                        <Link href="/contacto" className="hover:text-stone-900 transition-colors">Contacto</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-[#F5EFE6] pt-40 pb-32 px-6 text-center">
                <div className="container mx-auto max-w-4xl relative z-10">
                    <div className="mx-auto w-24 h-24 text-[#C8A232] mb-8">
                        {/* Central Logo Mark */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full opacity-80">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0l-5 5m5-5l5 5m-5-13a3 3 0 100 6 3 3 0 000-6z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
                        <span className="italic font-serif text-[#C8A232]">{heroTitle1}</span> <span className="font-bold font-serif">{heroTitle2}</span><br className="hidden md:block"/>
                        <span className="font-bold font-serif">{heroTitle3}</span> <span className="italic font-serif text-[#C8A232]">{heroTitle4}</span>
                    </h1>

                    <p className="text-xl md:text-2xl font-medium text-[#333333] mb-4">
                        {heroSub1}
                    </p>
                    <p className="text-[#666666] text-lg max-w-2xl mx-auto mb-12">
                        {heroSub2}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link href="/contacto" className="inline-flex items-center justify-center bg-[#CA9E33] hover:bg-[#b58b29] text-white font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-lg shadow-md transition-all">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Cotizar Proyecto
                        </Link>
                        <Link href="/portafolio" className="inline-flex items-center justify-center border border-gray-300 bg-[#EAE4DC] hover:bg-[#dfd7cc] text-[#1A1A1A] font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-lg shadow-sm transition-all">
                            Ver Portafolio
                        </Link>
                    </div>
                </div>
            </header>

            {/* Universo Eladora & 3 Universes */}
            <section className="bg-[#F8F9FA] py-32 px-6 relative overflow-hidden">
                {/* Decorative background vectors could go here */}
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl mb-6">
                        <span className="italic font-serif text-[#C8A232]">{aboutTitle1}</span> <span className="font-bold font-serif">{aboutTitle2}</span>
                    </h2>
                    <p className="text-[#C8A232] text-lg max-w-3xl mx-auto mb-20 leading-relaxed">
                        {aboutText}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-[#F5EFE6] rounded-3xl p-10 shadow-xl flex flex-col items-center text-center">
                            <Printer className="w-12 h-12 text-[#C8A232] mb-6 stroke-[1.5]" />
                            <h3 className="text-2xl mb-2">
                                <span className="italic font-serif text-[#C8A232]">Eladora Print</span>
                            </h3>
                            <p className="font-bold text-[#1A1A1A] mb-4">Imprenta Boutique</p>
                            <p className="text-[#555555] mb-8 flex-grow leading-relaxed">
                                Papelería fina, impresiones, tarjetas, etiquetas, empaques, detalles y piezas personalizadas.
                            </p>
                            <Link href="/servicios" className="bg-[#E5C583] hover:bg-[#d6b571] text-white px-8 py-2.5 rounded-full text-sm uppercase tracking-wide transition-colors">
                                Ver más
                            </Link>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#F5EFE6] rounded-3xl p-10 shadow-xl flex flex-col items-center text-center">
                            <PartyPopper className="w-12 h-12 text-[#C8A232] mb-6 stroke-[1.5]" />
                            <h3 className="text-2xl mb-2">
                                <span className="italic font-serif text-[#C8A232]">Eladora Moments</span>
                            </h3>
                            <p className="font-bold text-[#1A1A1A] mb-4">Barra creativa para eventos</p>
                            <p className="text-[#555555] mb-8 flex-grow leading-relaxed">
                                Barras de personalización para bodas, cumpleaños, eventos sociales y experiencias corporativas.
                            </p>
                            <Link href="/servicios" className="bg-[#E5C583] hover:bg-[#d6b571] text-white px-8 py-2.5 rounded-full text-sm uppercase tracking-wide transition-colors">
                                Ver más
                            </Link>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#F5EFE6] rounded-3xl p-10 shadow-xl flex flex-col items-center text-center">
                            <MonitorSmartphone className="w-12 h-12 text-[#C8A232] mb-6 stroke-[1.5]" />
                            <h3 className="text-2xl mb-2">
                                <span className="italic font-serif text-[#C8A232]">Eladora Studio</span>
                            </h3>
                            <p className="font-bold text-[#1A1A1A] mb-4">Diseño creativo digital</p>
                            <p className="text-[#555555] mb-8 flex-grow leading-relaxed">
                                Diseño gráfico, branding, invitaciones digitales, páginas web y soluciones creativas para marcas y proyectos.
                            </p>
                            <Link href="/servicios" className="bg-[#E5C583] hover:bg-[#d6b571] text-white px-8 py-2.5 rounded-full text-sm uppercase tracking-wide transition-colors">
                                Ver más
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Como Trabajamos */}
            <section className="bg-[#F8F9FA] py-20 px-6 border-t border-gray-200">
                <div className="container mx-auto max-w-6xl text-center">
                    <h2 className="text-4xl md:text-5xl mb-16">
                        <span className="italic font-serif text-[#C8A232]">¿Cómo</span> <span className="font-bold font-serif">trabajamos?</span>
                    </h2>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
                        {/* Decorative line connecting steps */}
                        <div className="hidden md:block absolute top-10 left-12 right-12 border-t-2 border-dashed border-[#C8A232]/40 z-0"></div>

                        {/* Step 1 */}
                        <div className="flex-1 text-center relative z-10 w-full">
                            <div className="w-20 h-20 bg-[#F8F9FA] border-2 border-[#C8A232] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8A232]">
                                <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Elige</h3>
                            <p className="text-[#C8A232] leading-relaxed">Explora nuestros productos y servicios.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex-1 text-center relative z-10 w-full">
                            <div className="w-20 h-20 bg-[#F8F9FA] border-2 border-[#C8A232] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8A232]">
                                <MessageCircle className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Cuéntanos</h3>
                            <p className="text-[#C8A232] leading-relaxed">Selecciona lo que necesitas o contáctanos para algo personalizado.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex-1 text-center relative z-10 w-full">
                            <div className="w-20 h-20 bg-[#F8F9FA] border-2 border-[#C8A232] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8A232]">
                                <Lightbulb className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Creamos</h3>
                            <p className="text-[#C8A232] leading-relaxed">Diseñamos, producimos y preparamos tu pedido.</p>
                        </div>

                        {/* Step 4 */}
                        <div className="flex-1 text-center relative z-10 w-full">
                            <div className="w-20 h-20 bg-[#F8F9FA] border-2 border-[#C8A232] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8A232]">
                                <Star className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Recibe</h3>
                            <p className="text-[#C8A232] leading-relaxed">Recoge, recibe o disfruta tu pedido en tu evento.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner 1 */}
            <section className="bg-[#DFB76C] py-20 px-6 text-center relative overflow-hidden">
                <div className="container mx-auto max-w-4xl relative z-10">
                    <h2 className="text-4xl md:text-5xl mb-6">
                        <span className="font-bold font-serif italic text-[#1A1A1A]">¿Tienes algo diferente</span> <span className="italic font-serif text-white">en mente?</span>
                    </h2>
                    <p className="text-[#5B4315] text-xl mb-10 max-w-2xl mx-auto">
                        Cuéntanos tu idea. En Eladora también creamos proyectos a medida.
                    </p>
                    <Link href="/contacto" className="inline-block bg-[#F5EFE6] hover:bg-white text-[#C8A232] font-semibold px-10 py-3.5 rounded-full text-lg shadow-sm transition-all">
                        Escríbenos
                    </Link>
                </div>
            </section>

            {/* Founder Section */}
            <section className="bg-[#F5EFE6] py-32 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="w-full md:w-1/2 relative">
                            {/* Decorative background crown */}
                            <div className="absolute inset-0 text-[#C8A232]/10 z-0 scale-150 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0l-5 5m5-5l5 5m-5-13a3 3 0 100 6 3 3 0 000-6z" />
                                </svg>
                            </div>
                            
                            <div className="relative z-10 aspect-[3/4] bg-white rounded-lg shadow-xl overflow-hidden mx-auto max-w-md" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 95%, 80% 100%, 60% 95%, 40% 100%, 20% 95%, 0 100%)' }}>
                                {/* Founder Image */}
                                {content.founder_img ? (
                                    <img src={`/storage/${content.founder_img}`} className="w-full h-full object-cover" alt={`${founderName1} ${founderName2}`} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#C8A232] bg-[#EAE4DC]">
                                        Foto Fundadora
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl mb-4">
                                <span className="italic font-serif text-[#C8A232]">{founderName1}</span> <span className="font-bold font-serif">{founderName2}</span>
                            </h2>
                            <p className="font-bold text-[#1A1A1A] mb-8 text-xl">
                                {founderRole}
                            </p>
                            <div className="text-[#C8A232] space-y-6 text-lg leading-relaxed max-w-lg">
                                <p>{founderText1}</p>
                                <p>{founderText2}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Services Section */}
            <section className="bg-[#F5EFE6] py-32 px-6 border-t border-[#DFB76C]/20">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl mb-6 italic font-serif text-[#C8A232]">Servicios</h2>
                        <p className="text-[#C8A232] text-xl max-w-2xl mx-auto">
                            Tres universos. Una misma intención: crear cosas que se sientan especiales.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="bg-[#F8F9FA] p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
                            <div className="flex items-center gap-4 mb-6">
                                <Printer className="w-10 h-10 text-[#C8A232]" />
                                <h3 className="font-bold text-2xl">Impresión boutique</h3>
                            </div>
                            <ul className="space-y-3 mb-10 text-[#4A4A4A] flex-grow">
                                <li>• Tarjetas</li>
                                <li>• Invitaciones</li>
                                <li>• Etiquetas y Stickers</li>
                                <li>• Menús y Place cards</li>
                                <li>• Papelería para eventos</li>
                                <li>• Papelería corporativa</li>
                                <li>• Empaques</li>
                                <li>• Detalles personalizados</li>
                                <li>• Proyectos especiales</li>
                            </ul>
                            <Link href="/contacto" className="bg-[#E5C583] hover:bg-[#d6b571] text-white w-full py-3 rounded-full text-center font-medium transition-colors">
                                Cotizar
                            </Link>
                        </div>

                        {/* Service 2 */}
                        <div className="bg-[#F8F9FA] p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
                            <div className="flex items-center gap-4 mb-6">
                                <PartyPopper className="w-10 h-10 text-[#C8A232]" />
                                <div>
                                    <h3 className="font-bold text-2xl leading-tight mb-1">Eladora Moments</h3>
                                    <p className="text-sm text-[#C8A232]">Barra creativa para eventos</p>
                                </div>
                            </div>
                            <p className="italic text-[#4A4A4A] mb-6 border-b pb-4">Personalización que sucede frente a tus invitados.</p>
                            <ul className="space-y-4 mb-10 text-[#4A4A4A] flex-grow">
                                <li><span className="font-bold">Barra Tiny:</span> Una pequeña experiencia de personalización</li>
                                <li><span className="font-bold">Barra Signature:</span> Nuestra experiencia esencial</li>
                                <li><span className="font-bold">Barra Boutique:</span> Una experiencia completamente personalizada</li>
                            </ul>
                            <Link href="/contacto" className="bg-[#E5C583] hover:bg-[#d6b571] text-white w-full py-3 rounded-full text-center font-medium transition-colors">
                                Cotizar
                            </Link>
                        </div>

                        {/* Service 3 */}
                        <div className="bg-[#F8F9FA] p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
                            <div className="flex items-center gap-4 mb-6">
                                <MonitorSmartphone className="w-10 h-10 text-[#C8A232]" />
                                <div>
                                    <h3 className="font-bold text-2xl leading-tight mb-1">Eladora Studio</h3>
                                    <p className="text-sm text-[#C8A232]">Diseño creativo digital</p>
                                </div>
                            </div>
                            <p className="italic text-[#4A4A4A] mb-6 border-b pb-4">Diseño para marcas, eventos y proyectos que necesitan una identidad propia.</p>
                            <ul className="space-y-3 mb-10 text-[#4A4A4A] flex-grow">
                                <li>• Branding</li>
                                <li>• Invitaciones digitales</li>
                                <li>• Diseño web</li>
                                <li>• Soluciones para eventos</li>
                                <li>• Consultoría creativa</li>
                            </ul>
                            <Link href="/servicios" className="bg-[#E5C583] hover:bg-[#d6b571] text-white w-full py-3 rounded-full text-center font-medium transition-colors">
                                Conocer más
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner 2 */}
            <section className="bg-[#DFB76C] py-24 px-6 text-center">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-4xl md:text-5xl mb-6">
                        <span className="font-bold font-serif italic text-[#1A1A1A]">Hagamos algo bonito</span> <span className="italic font-serif text-white">en conjunto</span>
                    </h2>
                    <p className="text-[#5B4315] text-xl mb-12 max-w-2xl mx-auto">
                        ¿Tienes un proyecto en mente? Cuéntanos qué necesitas y encontraremos la mejor forma de hacerlo realidad.
                    </p>
                    <Link href="/contacto" className="inline-block bg-[#F5EFE6] hover:bg-white text-[#C8A232] font-semibold px-12 py-4 rounded-full text-lg shadow-md transition-all">
                        Contacto
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#F5EFE6] text-[#1A1A1A] py-16 text-center border-t border-[#DFB76C]/30">
                <div className="container mx-auto px-6">
                    <div className="mx-auto w-16 h-16 text-[#C8A232] mb-8">
                        {/* Footer Logo Mark */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full opacity-80">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0l-5 5m5-5l5 5m-5-13a3 3 0 100 6 3 3 0 000-6z" />
                        </svg>
                    </div>
                    <div className="flex justify-center gap-6 mb-8 text-[#C8A232]">
                        <a href="#" className="hover:text-[#1A1A1A] transition-colors"><MessageCircle className="w-6 h-6" /></a>
                        <a href="#" className="hover:text-[#1A1A1A] transition-colors"><FileHeart className="w-6 h-6" /></a>
                    </div>
                    <p className="text-sm font-medium tracking-wide">© {new Date().getFullYear()} Eladora Print. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
