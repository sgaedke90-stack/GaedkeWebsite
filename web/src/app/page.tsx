import Image from "next/image";
import Link from "next/link"; 
import { Phone, ArrowRight, MessageSquare, Bot, Hammer, Ruler, HardHat } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.jpg" alt="Gaedke Construction" width={40} height={40} className="w-10 h-10 rounded object-cover" />
            <span className="font-serif text-xl font-bold tracking-tight text-white">Gaedke<span className="text-amber-500">Construction</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#services" className="hover:text-amber-500 transition-colors">Services</a>
            <Link href="/quote" className="hover:text-amber-500 transition-colors">Get a Quote</Link>
          </div>

          <Link href="/quote" className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded font-bold text-sm transition-all flex items-center gap-2">
            Start Quote <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-500 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Available for 2026 Projects
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1] mb-6">
              Premium <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200">Construction</span> <br/>
              & Remodels.
            </h1>
            <p className="text-lg text-zinc-400 mb-8 max-w-lg leading-relaxed">
              Ready to start? Choose how you want to connect with us below.
            </p>
            
            {/* --- THE 3 ACTIVE BUTTONS --- */}
            <div className="flex flex-col gap-3">
              
              {/* BUTTON 1: AI CHATBOT */}
              <Link href="/quote" className="w-full md:w-auto px-6 py-4 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition-colors text-lg flex items-center justify-center gap-3">
                <Bot size={24} className="text-black" />
                <span>Start Smart Quote</span>
                <span className="text-xs bg-black/10 px-2 py-0.5 rounded ml-2">AI BOT</span>
              </Link>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* BUTTON 2: TEXT MESSAGE */}
                <a href="sms:+17633180605?body=Hi Sean, I am interested in a quote for..." className="flex-1 px-6 py-4 bg-zinc-900 text-white font-bold rounded border border-zinc-800 hover:bg-zinc-800 transition-colors text-lg flex items-center justify-center gap-3">
                  <MessageSquare size={20} className="text-amber-500" /> Text Us
                </a>

                {/* BUTTON 3: PHONE CALL */}
                <a href="tel:+17633180605" className="flex-1 px-6 py-4 bg-zinc-900 text-white font-bold rounded border border-zinc-800 hover:bg-zinc-800 transition-colors text-lg flex items-center justify-center gap-3">
                  <Phone size={20} className="text-amber-500" /> Call Now
                </a>
              </div>
              
              <p className="text-zinc-500 text-sm mt-2 text-center md:text-left">
                Direct: (763) 318-0605 <span className="mx-2">•</span> Alt Text: (651) 592-5621
              </p>

            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative h-[500px] w-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" 
               alt="Luxury Home Construction" 
               className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute bottom-8 left-8 z-20">
                <p className="text-amber-500 font-bold text-sm mb-1">Featured Project</p>
                <p className="text-white text-xl font-serif">The Larson Residence</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-24 bg-zinc-900/50 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
               <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Our Expertise</h2>
               <p className="text-zinc-400 max-w-md">We specialize in high-stakes projects where attention to detail is non-negotiable.</p>
            </div>
            <Link href="/quote" className="text-amber-500 font-bold hover:text-amber-400 flex items-center gap-2">
               View All Services <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: HardHat, title: "Custom Home Builds", desc: "From foundation to finish, we manage the entire lifecycle of your dream home." },
              { icon: Hammer, title: "Major Renovations", desc: "Kitchens, basements, and additions that seamlessly blend with your existing structure." },
              { icon: Ruler, title: "Drafting & Design", desc: "In-house architectural planning to ensure your vision is buildable and beautiful." },
            ].map((service, i) => (
              <div key={i} className="p-8 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500/50 transition-colors group">
                <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                  <service.icon size={24} className="text-zinc-400 group-hover:text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}