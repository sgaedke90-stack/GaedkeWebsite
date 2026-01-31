import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight, MessageSquare, Lock, Hammer, Wrench, Home as HomeIcon } from "lucide-react";

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      {/* Luxury Navigation Header */}
      <nav className="header-brushed-metal fixed z-50 w-full">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Brand name */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold tracking-tight text-white hidden sm:inline">
              Gaedke
            </span>
            <span className="font-serif text-lg font-bold tracking-tight text-yellow-500 sm:hidden">
              GC
            </span>
          </div>

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

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/services" className="text-gray-300 hover:text-yellow-500 transition-colors">
              Services
            </Link>
            <a href="mailto:Sgaedke90@gmail.com?subject=Quote%20Request" className="text-gray-300 hover:text-yellow-500 transition-colors">
              Contact
            </a>
          </div>

          {/* Primary CTA Button */}
          <Link
            href="/quote"
            className="btn-gold flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-bold"
            title="Start AI quote chatbot"
          >
            <Lock size={14} />
            <span className="hidden sm:inline">Start Quote</span>
            <span className="sm:hidden">Quote</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero Section - Premium Typography */}
      <section className="relative overflow-hidden px-4 pt-40 pb-20 md:pt-52 md:pb-32">
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-500">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              Premium Construction 2026
            </div>

            <h1 className="mb-6 text-gold-gradient text-5xl md:text-6xl font-serif font-bold leading-tight">
              Premium<br />
              Construction<br />
              Services
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-300">
              Remodels built to last. Systems first. Finish second. Minnesota's premier construction expertise with luxury attention to detail.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4">
              {/* Primary: Gold Button with Lock */}
              <Link
                href="/quote"
                className="btn-gold inline-flex w-full md:w-auto items-center justify-center gap-3 px-8 py-4 text-base font-bold rounded-lg shadow-lg hover:shadow-2xl"
              >
                <Lock size={20} />
                <span>Start Smart Quote</span>
                <span className="ml-2 inline-block rounded-full bg-black/20 px-3 py-1 text-xs font-semibold">
                  AI POWERED
                </span>
              </Link>

              {/* Secondary CTA Options */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="sms:+17633180605?body=Hi%20Sean%2C%20I%20am%20interested%20in%20a%20quote%20for..."
                  className="btn-outline-gold flex flex-1 items-center justify-center gap-2 px-6 py-3 text-sm font-bold"
                  title="Send text message"
                >
                  <MessageSquare size={18} />
                  <span className="hidden sm:inline">Text Us</span>
                  <span className="sm:hidden">Text</span>
                </a>

                <a
                  href="tel:+17633180605"
                  className="btn-outline-gold flex flex-1 items-center justify-center gap-2 px-6 py-3 text-sm font-bold"
                  title="Call phone"
                >
                  <Phone size={18} />
                  <span className="hidden sm:inline">Call Now</span>
                  <span className="sm:hidden">Call</span>
                </a>
              </div>

              <p className="text-center text-xs sm:text-sm text-gray-500 md:text-left">
                Direct: (763) 318-0605 <span className="hidden sm:inline mx-2">•</span> <span className="block sm:inline">Text: (651) 592-5621</span>
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="group relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl border border-yellow-500/30">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent" />
            <Image
              src="/images/Design 2.jpg"
              alt="The Larson Residence - Luxury Home Remodel by Gaedke Construction in Minnesota"
              fill
              className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <p className="mb-1 text-sm font-bold text-yellow-500">Featured Project</p>
              <p className="text-xl font-serif text-white">The Larson Residence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="border-y border-yellow-500/20 bg-black py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-yellow-500">Services</p>
              <h2 className="text-gold-gradient text-4xl md:text-5xl font-serif font-bold mb-4">
                Premium Services
              </h2>
              <p className="max-w-md text-gray-400">
                High-stakes projects where attention to detail is non-negotiable. Your vision. Our expertise.
              </p>
            </div>
            <Link
              href="/services"
              className="btn-outline-gold flex items-center gap-2 px-6 py-3 font-bold rounded-lg whitespace-nowrap"
            >
              <span className="hidden sm:inline">View All Services</span>
              <span className="sm:hidden">All Services</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Service Cards Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Wrench,
                title: "Bathroom Remodeling",
                description: "Precision vanity integration, mechanical updates, and custom tile work for a spa-like feel.",
              },
              {
                icon: Hammer,
                title: "Kitchen Remodeling",
                description: "Complete transformations blending seamlessly with existing structures. Premium materials throughout.",
              },
              {
                icon: HomeIcon,
                title: "Basements & Additions",
                description: "Structural expertise in creating new living spaces that enhance your home's value and comfort.",
              },
            ].map((service, i) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={i}
                  className="card-luxury group rounded-lg border border-yellow-500/30 bg-black/40 p-6 md:p-8 backdrop-blur-sm"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-yellow-500/10 transition-colors group-hover:bg-yellow-500">
                    <ServiceIcon
                      size={28}
                      className="text-yellow-500 transition-colors group-hover:text-black"
                    />
                  </div>
                  <h3 className="mb-3 text-xl font-serif font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-gray-400">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center text-yellow-500 text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight size={14} className="ml-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-black border-t border-yellow-500/20 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-gold-gradient text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Start?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get your instant smart quote or contact us for a comprehensive consultation.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/quote"
              className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-lg shadow-lg"
            >
              <Lock size={18} />
              Start Smart Quote
            </Link>
            <a
              href="mailto:Sgaedke90@gmail.com?subject=Project%20Inquiry"
              className="btn-outline-gold inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-lg"
            >
              Contact Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
