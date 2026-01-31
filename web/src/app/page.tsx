import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight, MessageSquare, Bot, Hammer, Ruler, HardHat } from "lucide-react";

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Navigation bar */}
      <nav className="fixed z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              Gaedke
              <span className="text-amber-500">Construction</span>
            </span>
          </div>

          {/* Centered logo (clickable) */}
          <Link
            href="/"
            className="absolute left-1/2 top-0 h-20 flex -translate-x-1/2 items-center justify-center transform"
          >
            <Image
              src="/images/logo.jpg"
              alt="Gaedke Construction"
              width={56}
              height={56}
              className="rounded-full border-2 border-amber-500 object-cover"
            />
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
            <a href="#services" className="transition-colors hover:text-amber-500">
              Services
            </a>
            <Link href="/quote" className="transition-colors hover:text-amber-500">
              Get a Quote
            </Link>
          </div>

          <Link
            href="/quote"
            className="flex items-center gap-2 rounded bg-amber-500 px-5 py-2.5 font-bold text-black text-sm transition-all hover:bg-amber-400"
          >
            Start Quote <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-500">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Available for 2026 Projects
            </div>
            <h1 className="mb-6 text-5xl font-serif font-bold leading-[1.1] text-white md:text-7xl">
              Premium <br />
              <span className="bg-gradient-to-r from-amber-500 to-amber-200 bg-clip-text text-transparent">
                Construction
              </span>
              <br />
              & Remodels.
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-zinc-400">
              Ready to start? Choose how you want to connect with us below.
            </p>

            {/* Call-to-action buttons */}
            <div className="flex flex-col gap-3">
              {/* AI Chatbot button */}
              <Link
                href="/quote"
                className="flex w-full items-center justify-center gap-3 rounded bg-amber-500 px-6 py-4 text-lg font-bold text-black transition-colors hover:bg-amber-400 md:w-auto"
              >
                <Bot size={24} className="text-black" />
                <span>Start Smart Quote</span>
                <span className="ml-2 rounded bg-black/10 px-2 py-0.5 text-xs">
                  AI BOT
                </span>
              </Link>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Text message button */}
                <a
                  href="sms:+17633180605?body=Hi Sean, I am interested in a quote for..."
                  className="flex flex-1 items-center justify-center gap-3 rounded border border-zinc-800 bg-zinc-900 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-zinc-800"
                >
                  <MessageSquare size={20} className="text-amber-500" /> Text Us
                </a>

                {/* Phone call button */}
                <a
                  href="tel:+17633180605"
                  className="flex flex-1 items-center justify-center gap-3 rounded border border-zinc-800 bg-zinc-900 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-zinc-800"
                >
                  <Phone size={20} className="text-amber-500" /> Call Now
                </a>
              </div>

              <p className="text-center text-sm text-zinc-500 md:text-left">
                Direct: (763) 318-0605 <span className="mx-2">•</span> Alt Text: (651)
                592-5621
              </p>
            </div>
          </div>

          {/* Hero image */}
          <div className="group relative h-[500px] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
            <Image
              src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
              alt="Luxury Home Construction"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <p className="mb-1 text-sm font-bold text-amber-500">Featured Project</p>
              <p className="text-xl font-serif text-white">The Larson Residence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section id="services" className="border-y border-zinc-900 bg-zinc-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div>
              <h2 className="mb-4 text-3xl font-serif font-bold text-white md:text-4xl">
                Our Expertise
              </h2>
              <p className="max-w-md text-zinc-400">
                We specialize in high-stakes projects where attention to detail
                is non-negotiable.
              </p>
            </div>
            <Link
              href="/quote"
              className="flex items-center gap-2 font-bold text-amber-500 hover:text-amber-400"
            >
              View All Services <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: HardHat,
                title: "Custom Home Builds",
                desc: "From foundation to finish, we manage the entire lifecycle of your dream home.",
              },
              {
                icon: Hammer,
                title: "Major Renovations",
                desc: "Kitchens, basements, and additions that seamlessly blend with your existing structure.",
              },
              {
                icon: Ruler,
                title: "Drafting & Design",
                desc: "In-house architectural planning to ensure your vision is buildable and beautiful.",
              },
            ].map((service, i) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={i}
                  className="group rounded-xl border border-zinc-800 bg-zinc-950 p-8 transition-colors hover:border-amber-500/50"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 transition-colors group-hover:bg-amber-500">
                    <ServiceIcon
                      size={24}
                      className="text-zinc-400 transition-colors group-hover:text-black"
                    />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="leading-relaxed text-zinc-400">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}