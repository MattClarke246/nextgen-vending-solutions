/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Scene } from './components/Scene';
import {
  Zap,
  RefreshCw,
  Settings,
  Cpu,
  ArrowRight,
  ChevronDown,
  Palette,
  MousePointer2,
  Shield,
  BarChart3,
  Clock,
  Wifi
} from 'lucide-react';

// ── Easing presets ────────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const;
const easeSpring = { type: 'spring', stiffness: 260, damping: 22 };

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease, delay: i * 0.08 }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [customization, setCustomization] = useState<{
    brandColor: string;
    productType: 'drinks' | 'snacks' | 'mixed';
  }>({
    brandColor: '#0A0A0A',
    productType: 'mixed'
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const colors = [
    { hex: '#0A0A0A', label: 'Black' },
    { hex: '#8D9399', label: 'Wolf Grey' },
    { hex: '#8A0014', label: 'Red' },
    { hex: '#0B1A30', label: 'Dark Blue' },
  ];

  return (
    <div ref={containerRef} className="page-root">
      {/* Ambient bottom-right glow */}
      <div className="glow-br" />

      {/* 3D Vending Machine — fixed background layer */}
      <Scene scrollProgress={smoothProgress} customization={customization} />

      {/* ─────────────────────────────────────────────
          NAVIGATION
          ───────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full px-6 lg:px-14 py-5 z-50 pointer-events-none flex justify-between items-center">
        {/* Brand wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="nav-pill px-5 py-2.5 flex items-center gap-2.5 pointer-events-auto"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] animate-pulse" />
          <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-[#F0F0F5]">
            Next<span className="text-[#0A84FF]">Gen</span> Vending
          </span>
        </motion.div>

        {/* Nav links */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="nav-pill px-6 py-2.5 pointer-events-auto hidden md:block"
        >
          <ul className="flex gap-8 text-[12px] font-semibold uppercase tracking-widest text-[#5A5A70]">
            {['Services', 'Solutions', 'Clients', 'Support'].map((item) => (
              <li
                key={item}
                className="hover:text-[#F0F0F5] cursor-pointer transition-colors duration-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </nav>

      {/* ─────────────────────────────────────────────
          CUSTOMIZATION PANEL
          ───────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-6 right-6 md:left-auto md:w-auto md:bottom-8 md:right-8 z-50 flex justify-center pointer-events-none">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...easeSpring, delay: 0.6 }}
            className="config-panel p-4 md:p-5 w-full max-w-[320px] md:max-w-none md:w-56 pointer-events-auto"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#4DA6FF] mb-4">
              <Palette className="h-3 w-3" />
              Configure
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-5 md:gap-5">
              {/* Color swatches */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#5A5A70]">Finish</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(({ hex, label }) => (
                    <motion.button
                      key={hex}
                      title={label}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setCustomization(p => ({ ...p, brandColor: hex }))}
                      className="relative w-6 h-6 md:w-7 md:h-7 rounded-full transition-all"
                      style={{ backgroundColor: hex }}
                    >
                      {customization.brandColor === hex && (
                        <motion.span
                          layoutId="swatch-ring"
                          className="absolute inset-0 rounded-full"
                          style={{
                            boxShadow: '0 0 0 2px #08080C, 0 0 0 3.5px #0A84FF'
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Product Mix */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#5A5A70]">Product Mix</p>
                <div className="grid grid-cols-1 gap-1">
                  {(['drinks', 'snacks', 'mixed'] as const).map((type) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCustomization(p => ({ ...p, productType: type }))}
                      className={`py-1 md:py-1.5 rounded-lg md:rounded-xl text-[9px] font-bold capitalize transition-all ${
                        customization.productType === type
                          ? 'bg-[#0A84FF] text-white shadow-lg shadow-[#0A84FF]/30'
                          : 'bg-white/5 text-[#5A5A70] border border-white/07 hover:text-[#A0A0B0]'
                      }`}
                    >
                      {type}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/06">
              <p className="text-[9px] text-[#3D3D50] flex items-center gap-1.5">
                <MousePointer2 className="h-2.5 w-2.5" />
                Click machine to open
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═════════════════════════════════════════════
          HERO SECTION
          ═════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex flex-col justify-end md:justify-center pb-40 md:pb-0 px-6 lg:px-20 z-10 pointer-events-none">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-[480px] pointer-events-auto space-y-6 md:space-y-7 bg-[#08080C]/70 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 rounded-3xl border border-white/5 md:border-transparent"
        >
          <motion.div variants={fadeUp}>
            <span className="badge-sleek">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] inline-block" />
              Smart Vending Solutions
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[52px] lg:text-[72px] font-bold tracking-[-0.045em] leading-[0.95] text-gradient"
          >
            Managed<br />
            <span className="text-gradient-blue">Vending</span><br />
            Ecosystems.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[15px] text-[#5A5A70] leading-relaxed max-w-sm"
          >
            From smart restocks to autonomous maintenance — fully managed vending infrastructure for high-growth businesses.
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-3 pt-1">
            <button className="btn-primary">
              Get Started <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-8 pt-3">
            <div className="stat-pill">
              <span className="stat-value">99.8%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-pill">
              <span className="stat-value">IoT</span>
              <span className="stat-label">Smart Monitor</span>
            </div>
            <div className="stat-pill">
              <span className="stat-value">24hr</span>
              <span className="stat-label">Response</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#3D3D50]"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ═════════════════════════════════════════════
          SERVICES SECTION
          ═════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex flex-col justify-end md:justify-center py-24 md:py-36 px-6 lg:px-20 z-10 pointer-events-none">
        <motion.div
          className="max-w-[480px] pointer-events-auto space-y-8 md:space-y-10 bg-[#08080C]/70 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 rounded-3xl border border-white/5 md:border-transparent"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="section-divider" />
            <span className="badge-sleek">What We Offer</span>
            <h2 className="text-[40px] lg:text-[52px] font-bold tracking-[-0.04em] leading-[1.05] text-gradient">
              Premium<br />Services
            </h2>
          </motion.div>

          {/* Metric tiles 2x2 */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            {[
              { icon: <Shield className="h-4 w-4" />, value: '5-Year',      label: 'Hardware Warranty' },
              { icon: <BarChart3 className="h-4 w-4" />, value: 'Live',     label: 'Inventory Analytics' },
              { icon: <Clock className="h-4 w-4" />, value: '< 4hr',        label: 'Avg Response Time' },
              { icon: <Wifi className="h-4 w-4" />, value: 'AI-Ready',      label: 'Smart IoT Payments' },
            ].map(({ icon, value, label }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="metric-tile flex flex-col gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0A84FF]/12 border border-[#0A84FF]/18 flex items-center justify-center text-[#4DA6FF]">
                  {icon}
                </div>
                <div className="text-[20px] font-bold text-[#F0F0F5] tracking-tight leading-none">{value}</div>
                <div className="text-[10px] text-[#5A5A70] font-medium">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Service list */}
          <motion.div variants={fadeUp} className="space-y-2">
            {[
              { icon: <Zap className="h-4 w-4" />,       title: 'Installation & Setup',    desc: 'Professional placement and configuration of high-end vending units tailored to your space.' },
              { icon: <RefreshCw className="h-4 w-4" />,  title: 'Inventory Management',   desc: 'Real-time tracking and automated restocking to ensure your machines are always full.' },
              { icon: <Settings className="h-4 w-4" />,   title: 'Maintenance & Repairs',  desc: '24/7 technical support and proactive maintenance to minimize downtime.' },
              { icon: <Cpu className="h-4 w-4" />,        title: 'Smart Solutions',         desc: 'Contactless payments, touchscreens, and IoT connectivity for a modern experience.' },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="service-card"
                custom={i}
                variants={fadeUp}
                whileHover="hover"
              >
                <div className="service-icon">{icon}</div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold text-[#F0F0F5] mb-0.5">{title}</h3>
                  <p className="text-[11px] text-[#5A5A70] leading-relaxed">{desc}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#3D3D50] flex-shrink-0 self-center ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═════════════════════════════════════════════
          ENGINEERED FOR EXCELLENCE
          ═════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex flex-col justify-end md:justify-center py-24 md:py-36 px-6 lg:px-20 z-10 pointer-events-none">
        <motion.div
          className="max-w-[480px] pointer-events-auto space-y-8 md:space-y-10 bg-[#08080C]/70 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 rounded-3xl border border-white/5 md:border-transparent"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="section-divider" />
            <span className="badge-sleek">Technical Breakdown</span>
            <h2 className="text-[40px] lg:text-[52px] font-bold tracking-[-0.04em] leading-[1.05] text-gradient">
              Engineered for<br />Excellence
            </h2>
            <p className="text-[14px] text-[#5A5A70] leading-relaxed max-w-sm">
              Precision components and cutting-edge technology — built for longevity and zero interruption.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            {[
              { title: 'Internal Systems',   label: 'Maintenance', desc: 'High-efficiency cooling and mechanical delivery systems designed for longevity and reliability.' },
              { title: 'Modular Components', label: 'Repairs',     desc: 'Rapid swap-out parts enabling sub-hour repair visits and minimal service interruption.' },
              { title: 'Smart Tech Core',    label: 'Upgrades',    desc: 'Integrated payment surfaces, digital interfaces, and over-the-air firmware upgrades.' },
            ].map(({ title, label, desc }, i) => (
              <motion.div
                key={title}
                className="feature-card"
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <h3 className="text-[14px] font-bold text-[#F0F0F5]">{title}</h3>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-[#0A84FF]/12 text-[#4DA6FF] px-2.5 py-0.5 rounded-full border border-[#0A84FF]/18 ml-3 flex-shrink-0">
                    {label}
                  </span>
                </div>
                <p className="text-[12px] text-[#5A5A70] leading-relaxed">{desc}</p>
                <div className="mt-3 flex items-center text-[#0A84FF] text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═════════════════════════════════════════════
          BOOKING SECTION
          ═════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] py-24 md:py-36 px-6 lg:px-20 z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          className="book-card w-full max-w-xl pointer-events-auto"
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease }}
          viewport={{ once: true }}
        >
          <div className="mb-8">
            <div className="section-divider" />
            <h2 className="text-[28px] font-bold text-[#F0F0F5] mb-2 tracking-tight">Book Your Setup</h2>
            <p className="text-[13px] text-[#5A5A70]">Schedule a consultation for custom hardware and managed replenishment services.</p>
          </div>

          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5A70]">Business Name</label>
                <input className="form-input" placeholder="Enter company name" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5A70]">Service Type</label>
                <select className="form-input appearance-none cursor-pointer" style={{ backgroundImage: 'none' }} defaultValue="">
                  <option value="" disabled>Select a service</option>
                  <option value="install">Hardware Installation</option>
                  <option value="inventory">Restocking & Managed Inventory</option>
                  <option value="branding">Custom Branding</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A5A70]">Contact Email</label>
              <input className="form-input" type="email" placeholder="name@company.com" />
            </div>

            <motion.button
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98, y: 1 }}
              className="btn-primary w-full mt-2"
              style={{ borderRadius: '14px', height: '48px', fontSize: '13px' }}
            >
              Schedule Service →
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────
          FOOTER
          ───────────────────────────────────────────── */}
      <footer className="relative py-10 px-6 lg:px-20 z-10 border-t border-white/06 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
            <span className="text-[12px] font-bold tracking-widest uppercase text-[#F0F0F5]">
              NEXTGEN VENDING
            </span>
          </div>
          <div className="flex gap-8 text-[10px] text-[#3D3D50] uppercase tracking-widest">
            <span>Birmingham · NYC · Atlanta</span>
            <span>© 2025 NextGen Vending Solutions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
