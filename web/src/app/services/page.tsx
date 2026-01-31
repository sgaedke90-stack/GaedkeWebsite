import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Hammer, Home, Wrench, Zap, Waves, Shield, Lock } from "lucide-react";

export default function ServicesPage(): JSX.Element {
  const services = [
    {
      icon: Zap,
      title: "Storm Damage Restoration",
      description: "Expert assessment and repair for homes affected by Minnesota's severe weather. Rapid response, professional recovery.",
      image: "/images/Previous Work.jpg",
      altText: "Storm Damage Restoration by Gaedke Construction in Minnesota"
    },
    {
      icon: Shield,
      title: "Roofing & Siding",
      description: "Precision installation of high-durability roofing and premium siding for maximum protection and curb appeal.",
      image: "/images/website example.jpg",
      altText: "Professional Roofing and Siding Installation by Gaedke Construction"
    },
    {
      icon: Wrench,
      title: "Flooring & Tile",
      description: "Professional installation of hardwood, laminate, and custom tile work for bathrooms and kitchens with lasting quality.",
      image: "/images/vanitybanda.jpg",
      altText: "Custom Flooring and Tile Work by Gaedke Construction in Minnesota"
    },
    {
      icon: Hammer,
      title: "Drywall Repair & Finishing",
      description: "Seamless repairs and professional finishing to prep your walls for a luxury look. No shortcuts, no compromises.",
      image: "/images/Design 1.jpg",
      altText: "Professional Drywall Repair and Finishing Services"
    },
    {
      icon: Home,
      title: "Bathroom Specialists",
      description: "Full-service remodels including custom vanities, mechanical integration, and code-compliant plumbing solutions.",
      image: "/images/Chat exampl.jpg",
      altText: "Luxury Bathroom Remodel by Gaedke Construction in Saint Francis, MN"
    },
    {
      icon: Waves,
      title: "Exterior Specialist",
      description: "Comprehensive upgrades for curb appeal, including paver walkways, grand entrances, and outdoor living spaces.",
      image: "/images/Walkupbanda.jpg",
      altText: "Professional Exterior Design and Paver Walkways by Gaedke Construction"
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      {/* Navigation bar */}
      <nav className="header-brushed-metal fixed z-50 w-full">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back Home</span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* Centered logo */}
          <Link
            href="/"
            className="absolute left-1/2 top-0 h-20 flex -translate-x-1/2 items-center justify-center transform"
          >
            <Image
              src="/images/logo.jpg"
              alt="Gaedke Construction"
              width={56}
              height={56}
              className="rounded-full border-2 border-yellow-500 object-cover shadow-lg"
            />
          </Link>

          <Link
            href="/quote"
            className="btn-gold flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded"
            title="Start AI quote chatbot"
          >
            <Lock size={14} />
            <span className="hidden sm:inline">Get Quote</span>
            <span className="sm:hidden">Quote</span>
          </Link>
        </div>
      </nav>

      {/* Header section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-500">
            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            Professional Expertise
          </div>
          <h1 className="mb-6 text-gold-gradient text-5xl md:text-6xl font-serif font-bold leading-tight">
            Our <br />
            Professional<br />
            Services.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-300">
            From storm damage restoration to luxury bathroom remodels, Gaedke Construction brings Minnesota-licensed expertise to every project. We don't just build—we elevate.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="border-y border-yellow-500/20 bg-black py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={i}
                  className="card-luxury group rounded-lg border border-yellow-500/30 overflow-hidden bg-black/40 backdrop-blur-sm flex flex-col h-full"
                >
                  {/* Project Image */}
                  {service.image && (
                    <div className="relative h-48 overflow-hidden bg-black/60">
                      <Image
                        src={service.image}
                        alt={service.altText}
                        fill
                        className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10 transition-colors duration-300 group-hover:bg-yellow-500">
                      <ServiceIcon
                        size={28}
                        className="text-yellow-500 transition-colors duration-300 group-hover:text-black"
                      />
                    </div>
                    <h3 className="mb-3 text-xl font-serif font-bold text-white">
                      {service.title}
                    </h3>
                    <p className="leading-relaxed text-gray-400 text-sm md:text-base">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-black border-t border-yellow-500/20 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-gold-gradient text-4xl md:text-5xl font-serif font-bold">
            Ready to Transform Your Home?
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            Get an instant AI-powered estimate or contact us directly for a comprehensive consultation.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/quote"
              className="btn-gold flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-lg"
            >
              <Lock size={18} />
              Start Smart Quote
            </Link>
            <a
              href="mailto:Sgaedke90@gmail.com?subject=Service%20Inquiry"
              className="btn-outline-gold flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-lg"
            >
              Email Directly
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-yellow-500/20 bg-black px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <p className="font-serif font-bold text-yellow-500">Gaedke Construction LLC</p>
              <p className="text-sm text-gray-500">Minnesota Licensed Contractor</p>
            </div>
            <div className="text-center text-sm text-gray-500">
              <p>(763) 318-0605 <span className="mx-2">•</span> Sgaedke90@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
