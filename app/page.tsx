"use client";
import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "ZEROGRID",
  image: "https://zerogrid.com/logo.png",
  description:
    "Elite cybersecurity infrastructure. Cloud Security, VAPT, and Red Team operations.",
  url: "https://zerogrid.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    addressCountry: "US",
  },
  priceRange: "$$$",
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- ATMOSPHERE LAYERS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        {/* Ambient Glow */}
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#ccff00]/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#ccff00] transition-colors">
              <span className="font-mono font-bold text-[#ccff00]">Z</span>
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-white group-hover:bg-[#ccff00]"></div>
              <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-white group-hover:bg-[#ccff00]"></div>
            </div>
            <span className="font-mono text-lg font-bold tracking-tight text-white">
              ZERO<span className="text-[#ccff00]">GRID</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-mono text-xs font-medium tracking-widest">
            {["Services", "Protocol", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-400 hover:text-[#ccff00] transition-colors uppercase relative group"
              >
                <span className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#ccff00]">
                  &gt;
                </span>
                {item}
              </a>
            ))}
            <Link
              href="/login"
              className="bg-white text-black px-5 py-2 hover:bg-[#ccff00] transition-colors font-bold uppercase"
            >
              Client_Access
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Terminal Badge */}
              <div className="mb-8 inline-flex items-center gap-3 px-3 py-1 bg-[#ccff00]/5 border border-[#ccff00]/20 text-[#ccff00] text-xs font-mono">
                <span className="w-1.5 h-1.5 bg-[#ccff00] animate-pulse"></span>
                SYSTEM STATUS: OPTIMAL
              </div>

              <h1 className="font-mono text-4xl md:text-7xl font-bold text-white leading-[0.95] mb-8 uppercase tracking-tighter">
                Secure The <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-white/50">
                  Infrastructure
                </span>
              </h1>

              <p className="font-sans text-lg text-gray-400 mb-10 max-w-xl leading-relaxed border-l-2 border-[#ccff00]/50 pl-6">
                Enterprise-grade cybersecurity solutions designed for
                high-threat environments. We specialize in offensive security,
                cloud hardening, and red team operations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/register"
                  className="group relative px-8 py-4 bg-[#ccff00] text-black font-mono font-bold uppercase tracking-wide overflow-hidden hover:translate-x-1 transition-transform"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Initialize Audit
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="square"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                </Link>
                <a
                  href="#services"
                  className="px-8 py-4 border border-white/20 text-white font-mono uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                >
                  View Vectors
                </a>
              </div>
            </div>

            {/* Right Content: Abstract Scanner Visual */}
            <div className="lg:col-span-5 relative h-[400px] border border-white/10 bg-[#0a0a0a] overflow-hidden hidden lg:block">
              {/* Scanline Animation */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ccff00] shadow-[0_0_20px_#ccff00] animate-[scan_3s_ease-in-out_infinite]"></div>

              <div className="p-4 font-mono text-xs text-gray-500 space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-2 mb-4">
                  <span>root@zerogrid:~#</span>
                  <span className="text-[#ccff00]">CONNECTED</span>
                </div>
                {[
                  {
                    code: "scanning_ports...",
                    status: "COMPLETE",
                    color: "text-gray-400",
                  },
                  {
                    code: "checking_firewall",
                    status: "VERIFIED",
                    color: "text-[#ccff00]",
                  },
                  {
                    code: "analyzing_traffic",
                    status: "0 THREATS",
                    color: "text-[#ccff00]",
                  },
                  {
                    code: "cloud_integrity",
                    status: "SECURE",
                    color: "text-[#ccff00]",
                  },
                ].map((line, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center opacity-0 animate-[fadeIn_0.5s_forwards]"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    <span className="text-gray-400">./{line.code}</span>
                    <span className={line.color}>[{line.status}]</span>
                  </div>
                ))}

                {/* Visual Data Block */}
                <div className="mt-8 grid grid-cols-4 gap-1 opacity-20">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 ${
                        (i * 7) % 3 === 0
                          ? "bg-[#ccff00]"
                          : "bg-transparent border border-[#ccff00]"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SCROLLING TICKER --- */}
        <div className="border-y border-white/10 bg-[#0a0a0a] overflow-hidden py-4">
          <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="mx-8 font-mono text-xs text-gray-500 uppercase tracking-widest"
              >
                /// PROTECTING ASSETS /// SECURING CLOUD /// ZERO TRUST ///
              </span>
            ))}
          </div>
        </div>

        {/* --- SERVICES GRID --- */}
        <section id="services" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
            <h2 className="text-3xl md:text-5xl font-mono font-bold text-white uppercase">
              Defense{" "}
              <span className="text-stroke-white text-transparent">Matrix</span>
            </h2>
            <div className="text-right mt-4 md:mt-0">
              <p className="font-mono text-[#ccff00] text-sm">
                AVAILABLE MODULES
              </p>
              <p className="font-sans text-gray-500 text-sm">v2.4.0-stable</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0 border-t border-l border-white/10">
            {/* Card 1 */}
            <div className="group relative border-r border-b border-white/10 bg-[#050505] p-10 hover:bg-[#0a0a0a] transition-colors">
              <div className="font-mono text-4xl text-[#ccff00] mb-6 font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                01
              </div>
              <h3 className="text-xl font-mono font-bold text-white mb-4 uppercase">
                Cloud Security
              </h3>
              <p className="font-sans text-gray-400 text-sm leading-relaxed mb-8">
                Hardened architecture for AWS, Azure, and GCP. We secure the
                perimeter, IAM roles, and data encryption standards to prevent
                leaks.
              </p>
              <div className="w-full h-[1px] bg-white/10 group-hover:bg-[#ccff00] transition-colors"></div>
            </div>

            {/* Card 2 */}
            <div className="group relative border-r border-b border-white/10 bg-[#050505] p-10 hover:bg-[#0a0a0a] transition-colors">
              <div className="font-mono text-4xl text-[#ccff00] mb-6 font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                02
              </div>
              <h3 className="text-xl font-mono font-bold text-white mb-4 uppercase">
                VAPT Operations
              </h3>
              <p className="font-sans text-gray-400 text-sm leading-relaxed mb-8">
                Vulnerability Assessment & Penetration Testing. Our team
                simulates real-world attacks to find gaps before adversaries do.
              </p>
              <div className="w-full h-[1px] bg-white/10 group-hover:bg-[#ccff00] transition-colors"></div>
            </div>

            {/* Card 3 */}
            <div className="group relative border-r border-b border-white/10 bg-[#050505] p-10 hover:bg-[#0a0a0a] transition-colors">
              <div className="font-mono text-4xl text-[#ccff00] mb-6 font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                03
              </div>
              <h3 className="text-xl font-mono font-bold text-white mb-4 uppercase">
                Red Teaming
              </h3>
              <p className="font-sans text-gray-400 text-sm leading-relaxed mb-8">
                Full-scope adversarial simulation. We test your SOC's detection
                and response capabilities against sophisticated threat actors.
              </p>
              <div className="w-full h-[1px] bg-white/10 group-hover:bg-[#ccff00] transition-colors"></div>
            </div>
          </div>
        </section>

        {/* --- FEATURES / WHY US --- */}
        <section
          id="features"
          className="py-24 bg-[#080808] border-y border-white/5 relative"
        >
          {/* Decorative Grid Background for this section */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-mono font-bold text-white mb-6">
                  THE ZEROGRID <span className="text-[#ccff00]">STANDARD</span>
                </h2>
                <div className="space-y-8 font-mono">
                  {[
                    {
                      title: "24/7 Surveillance",
                      desc: "Continuous monitoring of your digital perimeter.",
                    },
                    {
                      title: "Zero Trust",
                      desc: "Strict identity verification for every person and device.",
                    },
                    {
                      title: "Rapid Response",
                      desc: "Incident containment within minutes, not hours.",
                    },
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="w-1 h-full bg-white/10 group-hover:bg-[#ccff00] transition-colors min-h-[50px]"></div>
                      <div>
                        <h4 className="text-white font-bold uppercase mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-500 text-sm font-sans">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Visualization Placeholder */}
              <div className="border border-white/10 bg-black p-6 relative">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white"></div>

                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between text-xs font-mono text-gray-500 mb-8">
                    <span>TRAFFIC_ANALYSIS</span>
                    <span>LIVE</span>
                  </div>
                  {/* Bars */}
                  <div className="flex items-end justify-between h-40 gap-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-[#ccff00] w-full opacity-50 hover:opacity-100 transition-opacity"
                        style={{
                          height: `${20 + ((i * 23) % 80)}%`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between font-mono text-xs text-[#ccff00]">
                    <span>INBOUND: 450MB/s</span>
                    <span>THREATS: 0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer
          id="contact"
          className="bg-[#050505] pt-24 pb-12 px-6 border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-12 mb-20">
              <div className="md:col-span-5">
                <Link
                  href="/"
                  className="font-mono text-2xl font-bold text-white mb-6 block"
                >
                  ZEROGRID<span className="text-[#ccff00]">_</span>
                </Link>
                <p className="font-sans text-gray-500 max-w-sm mb-8">
                  Defining the future of digital security. We build the shields
                  that protect the modern internet economy.
                </p>
                <div className="flex gap-4">
                  {/* Social placeholders as raw text */}
                  {["TWITTER", "LINKEDIN", "GITHUB"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="font-mono text-xs text-white border border-white/20 px-3 py-1 hover:bg-white hover:text-black transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>

              <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-mono text-[#ccff00] text-xs font-bold mb-6">
                    SITEMAP
                  </h4>
                  <ul className="space-y-3 font-sans text-sm text-gray-400">
                    <li>
                      <Link href="#" className="hover:text-white transition">
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition">
                        Intelligence
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[#ccff00] text-xs font-bold mb-6">
                    LEGAL
                  </h4>
                  <ul className="space-y-3 font-sans text-sm text-gray-400">
                    <li>
                      <Link href="#" className="hover:text-white transition">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition">
                        SLA
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-[#ccff00] text-xs font-bold mb-6">
                    CONTACT
                  </h4>
                  <ul className="space-y-3 font-sans text-sm text-gray-400">
                    <li>contact@zerogrid.com</li>
                    <li>+1 (555) 000-SECURE</li>
                    <li>San Francisco, CA</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-mono uppercase">
              <p>&copy; 2024 ZEROGRID INC. ALL RIGHTS RESERVED.</p>
              <p className="mt-2 md:mt-0">ENCRYPTED CONNECTION</p>
            </div>
          </div>
        </footer>
      </main>

      {/* --- INLINE STYLES FOR ANIMATIONS --- */}
      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .text-stroke-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
