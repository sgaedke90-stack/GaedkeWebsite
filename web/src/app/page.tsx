import React from 'react';
import { Phone, CheckCircle2, Hammer, Home, Ruler, Shield, Clock, ArrowRight, Menu } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* --- Navigation --- */}
      <nav className="fixed w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 flex items-center justify-center rounded text-black font-bold text-2xl">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white leading-none">
                Gaedke
              </span>
              <span className="text-sm md:text-base text-zinc-400 tracking-wider uppercase">
                Construction LLC
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="#" className="hover:text-amber-500 transition-colors">Home</a>
            <a href="#services" className="hover:text-amber-500 transition-colors">Services</a>
            <a href="#projects" className="hover:text-amber-500 transition-colors">Our Work</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:7633180605" className="px-6 py-3 border border-zinc-700 hover:border-amber-500 text-white rounded hover:text-amber-500 transition-all duration-300 font-medium">
              Call (763) 318-0605
            </a>
          </div>
          <button className="md:hidden text-white"><Menu size={32} /></button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop" 
            alt="Luxury Home Build"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-zinc-800/80 border border-zinc-700 text-amber-500 text-xs font-bold tracking-widest uppercase mb-6">
              Minnesota's Trusted Construction Company
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Premium Construction <br /> 
              <span className="text-zinc-400">& Remodels.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl leading-relaxed">
              Craftsmanship you can trust. From custom home builds to complete renovations, we deliver exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition-colors text-lg">Request a Quote</button>
              <button className="px-8 py-4 bg-transparent border border-zinc-600 text-white font-semibold rounded hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                <Phone size={20} /> (763) 318-0605
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Services Section --- */}
      <section id="services" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 mb-4">What We Do Best</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard icon={<Home />} title="Custom Home Building" desc="From foundation to finishing touches, we build dream homes." />
            <ServiceCard icon={<Hammer />} title="Kitchen Remodels" desc="Transform your kitchen into a stunning, functional space." />
            <ServiceCard icon={<Ruler />} title="Bathroom Renovations" desc="Create your own spa retreat with luxurious tile work." />
            <ServiceCard icon={<Home />} title="Basement Finishing" desc="Maximize your home's potential with finished basements." />
            <ServiceCard icon={<Hammer />} title="Deck & Outdoor Living" desc="Extend your living space outdoors with custom decks." />
            <ServiceCard icon={<Ruler />} title="General Contracting" desc="Major renovations and project management." />
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-amber-500 font-bold tracking-widest uppercase text-sm">Our Work</span>
              <h2 className="text-4xl font-serif font-bold mt-2">Featured Projects</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors border border-zinc-700 px-4 py-2 rounded">
              View All Projects <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard category="Kitchen Remodel" title="Modern Kitchen" location="Edina, MN" img="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80" />
            <ProjectCard category="Deck & Patio" title="Screened Porch" location="Coon Rapids, MN" img="https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80" />
            <ProjectCard category="Exterior" title="Deck Upgrade" location="Blaine, MN" img="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80" />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-zinc-950 pt-20 pb-10 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500 flex items-center justify-center rounded text-black font-bold text-xl">G</div>
            <span className="text-2xl font-serif font-bold text-white">Gaedke</span>
          </div>
          <p className="text-zinc-600 text-sm">&copy; {new Date().getFullYear()} Gaedke Construction LLC.</p>
        </div>
      </footer>
    </main>
  );
}

function ServiceCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded hover:border-amber-500/50 transition-colors group">
      <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-black transition-colors">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}

function ProjectCard({ category, title, location, img }: { category: string, title: string, location: string, img: string }) {
  return (
    <div className="group relative h-80 rounded-lg overflow-hidden bg-zinc-800 cursor-pointer">
      <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <span className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-2 block">{category}</span>
        <h3 className="text-2xl font-serif font-bold text-white mb-1">{title}</h3>
        <p className="text-zinc-400 text-sm">{location}</p>
      </div>
    </div>
  )
}