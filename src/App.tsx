/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Scene } from './components/Scene';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  RefreshCw, 
  Settings, 
  Cpu, 
  ArrowRight,
  ChevronDown,
  Palette,
  Package,
  MousePointer2,
  Shield,
  BarChart3,
  Clock
} from 'lucide-react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [customization, setCustomization] = useState<{
    brandColor: string;
    productType: 'drinks' | 'snacks' | 'mixed';
  }>({
    brandColor: '#E3E4E5',
    productType: 'mixed'
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="page-root relative bg-bg">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full px-6 lg:px-16 py-5 flex justify-between items-center z-50 pointer-events-none">
        <div className="glass px-5 py-2.5 rounded-2xl flex items-center gap-3 pointer-events-auto shadow-sm">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-extrabold text-sm tracking-[0.18em] uppercase text-[#1C1C1E]">
            NEXTGEN<span className="text-accent mx-1">•</span>VENDING
          </span>
        </div>
        <div className="glass px-6 py-2.5 rounded-2xl pointer-events-auto shadow-sm">
          <ul className="hidden md:flex gap-8 text-[12px] font-semibold uppercase tracking-widest text-text-muted">
            <li className="hover:text-[#1C1C1E] cursor-pointer transition-colors">Services</li>
            <li className="hover:text-[#1C1C1E] cursor-pointer transition-colors">Solutions</li>
            <li className="hover:text-[#1C1C1E] cursor-pointer transition-colors">Clients</li>
            <li className="hover:text-[#1C1C1E] cursor-pointer transition-colors">Support</li>
          </ul>
        </div>
      </nav>

      {/* 3D Scene Background */}
      <Scene scrollProgress={smoothProgress} customization={customization} />

      {/* Customization UI Overlay */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-5 w-60 space-y-5"
          >
            <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest">
              <Palette className="h-3.5 w-3.5" /> Configure Machine
            </div>
            
            <div className="space-y-2.5">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Machine Finish</Label>
              <div className="flex gap-2 items-center">
                {[
                  { color: '#E3E4E5', label: 'Silver' },
                  { color: '#5C5C5F', label: 'Space Gray' },
                  { color: '#2E3641', label: 'Midnight' },
                  { color: '#E00021', label: 'Red' }
                ].map(({ color, label }) => (
                  <button
                    key={color}
                    title={label}
                    onClick={() => setCustomization(prev => ({ ...prev, brandColor: color }))}
                    className={`w-7 h-7 rounded-full border-[2.5px] transition-all shadow-sm ${customization.brandColor === color ? 'border-accent scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Product Mix</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['drinks', 'snacks', 'mixed'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCustomization(prev => ({ ...prev, productType: type }))}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold capitalize transition-all ${customization.productType === type ? 'bg-accent text-white shadow-sm' : 'bg-white/60 text-text-muted hover:bg-white border border-border'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E5EA]/60">
              <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
                <MousePointer2 className="h-3 w-3" /> Click machine to open
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative h-screen flex items-center px-6 lg:px-20 z-10 pointer-events-none">
        <div className="max-w-lg pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="space-y-6"
          >
            <span className="badge-sleek">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              Smart Vending Solutions
            </span>

            <h1 className="text-[52px] lg:text-[72px] font-bold tracking-[-0.04em] leading-[1.0] text-gradient">
              Managed<br />
              <span className="text-accent">Vending</span><br />
              Ecosystems.
            </h1>

            <p className="text-base text-text-muted leading-relaxed max-w-sm">
              From smart restocks to autonomous maintenance — fully managed vending for high-growth businesses.
            </p>

            <div className="flex gap-3">
              <button className="px-6 py-3 rounded-2xl bg-accent text-white text-sm font-semibold tracking-wide hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-95">
                Get Started
              </button>
              <button className="px-6 py-3 rounded-2xl bg-white/70 backdrop-blur text-[#1C1C1E] text-sm font-semibold tracking-wide hover:bg-white transition-all border border-border active:scale-95">
                Learn More
              </button>
            </div>
            
            <div className="flex gap-8 pt-4">
              <div className="stat-pill">
                <span className="stat-value">99.8%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat-pill">
                <span className="stat-value">IoT Ready</span>
                <span className="stat-label">Smart Monitor</span>
              </div>
              <div className="stat-pill">
                <span className="stat-value">24hr</span>
                <span className="stat-label">Response</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </section>

      {/* ── Services Section ── */}
      <section className="relative min-h-screen py-36 px-6 lg:px-20 z-10 pointer-events-none">
        <div className="max-w-lg pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <div className="section-divider" />
              <span className="badge-sleek">What We Offer</span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-gradient mt-2">
                Premium Services
              </h2>
            </div>

            {/* 2-col metric grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Shield className="h-4 w-4" />, metric: '5-Year', detail: 'Hardware Warranty' },
                { icon: <BarChart3 className="h-4 w-4" />, metric: 'Real-Time', detail: 'Inventory Analytics' },
                { icon: <Clock className="h-4 w-4" />, metric: '< 4hr', detail: 'Avg. Response Time' },
                { icon: <Cpu className="h-4 w-4" />, metric: 'Contactless', detail: 'AI-Enabled Payments' },
              ].map(({ icon, metric, detail }) => (
                <motion.div
                  key={detail}
                  whileHover={{ y: -3 }}
                  className="glass p-4 flex flex-col gap-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">{icon}</div>
                  <div className="text-xl font-bold text-[#1C1C1E] tracking-tight">{metric}</div>
                  <div className="text-[11px] text-text-muted font-medium">{detail}</div>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-3">
              <ServiceItem 
                icon={<Zap className="h-5 w-5" />}
                title="Installation & Setup"
                description="Professional placement and configuration of high-end vending units tailored to your space."
              />
              <ServiceItem 
                icon={<RefreshCw className="h-5 w-5" />}
                title="Inventory Management"
                description="Real-time tracking and automated restocking to ensure your machines are always full."
              />
              <ServiceItem 
                icon={<Settings className="h-5 w-5" />}
                title="Maintenance & Repairs"
                description="24/7 technical support and proactive maintenance to minimize downtime."
              />
              <ServiceItem 
                icon={<Cpu className="h-5 w-5" />}
                title="Smart Solutions"
                description="Contactless payments, touchscreens, and IoT connectivity for a modern experience."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Exploded View Section ── */}
      <section className="relative min-h-screen py-36 px-6 lg:px-20 z-10 pointer-events-none">
        <div className="max-w-lg pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <div className="section-divider" />
              <span className="badge-sleek">Technical Breakdown</span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-gradient mt-2">
                Engineered for<br />Excellence
              </h2>
              <p className="text-text-muted text-base mt-4 leading-relaxed max-w-sm">
                Precision components and cutting-edge technology — built for longevity and zero interruption.
              </p>
            </div>

            <div className="space-y-3">
              <FeatureCard 
                title="Internal Systems"
                label="Maintenance"
                description="High-efficiency cooling and mechanical delivery systems designed for longevity."
              />
              <FeatureCard 
                title="Modular Components"
                label="Repairs"
                description="Rapid swap-out parts that enable sub-hour repair visits and minimal downtime."
              />
              <FeatureCard 
                title="Smart Tech Core"
                label="Upgrades"
                description="Integrated payment surfaces, digital interfaces, and OTA firmware upgrades."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Booking Section ── */}
      <section className="relative min-h-screen py-36 px-6 lg:px-20 z-10 flex items-center justify-center pointer-events-none">
        <div className="side-panel-card w-full max-w-xl pointer-events-auto">
          <div className="mb-8">
            <div className="section-divider" />
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1C1C1E] mb-2 tracking-tight">Book Your Setup</h2>
            <p className="text-text-muted text-sm">Schedule a consultation for custom hardware and managed replenishment services.</p>
          </div>
          
          <form className="grid gap-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="business" className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Business Name</Label>
                <Input id="business" placeholder="Enter company name" className="bg-white border-[#D1D1D6] focus:border-accent h-11 text-[#1C1C1E] placeholder:text-[#C7C7CC] rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="service" className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Service Type</Label>
                <Select>
                  <SelectTrigger className="bg-white border-[#D1D1D6] h-11 text-[#1C1C1E] rounded-xl text-sm">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#D1D1D6] text-[#1C1C1E]">
                    <SelectItem value="install">Hardware Installation</SelectItem>
                    <SelectItem value="inventory">Restocking & Managed Inventory</SelectItem>
                    <SelectItem value="branding">Custom Branding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Contact Email</Label>
              <Input id="email" type="email" placeholder="name@company.com" className="bg-white border-[#D1D1D6] focus:border-accent h-11 text-[#1C1C1E] placeholder:text-[#C7C7CC] rounded-xl text-sm" />
            </div>

            <Button className="w-full bg-accent text-white hover:bg-accent/90 active:scale-[0.98] transition-all h-12 text-sm font-semibold tracking-widest mt-2 shadow-lg shadow-accent/20 rounded-2xl">
              Schedule Service →
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 px-6 lg:px-20 z-10 border-t border-[#D1D1D6]/60 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="font-bold text-sm tracking-widest uppercase text-[#1C1C1E]">NEXTGEN VENDING</div>
          </div>
          <div className="flex gap-8 text-[10px] text-text-muted uppercase tracking-widest">
            <div>BIRMINGHAM · NYC · ATLANTA</div>
            <div>© 2025 NEXTGEN VENDING SOLUTIONS</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      className="flex gap-4 p-4 rounded-2xl transition-all duration-300 ease-out bg-white/60 backdrop-blur-sm border border-white/80 hover:border-accent/30 hover:bg-white hover:shadow-md group cursor-pointer"
      whileHover={{ x: 4 }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center text-accent transition-colors group-hover:bg-accent group-hover:text-white">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-[#1C1C1E] mb-0.5">{title}</h3>
        <p className="text-text-muted text-xs leading-relaxed">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-text-muted ml-auto flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

function FeatureCard({ title, label, description }: { title: string, label: string, description: string }) {
  return (
    <motion.div 
      className="glass p-5 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-bold text-[#1C1C1E]">{title}</h3>
        <span className="text-[9px] font-mono font-semibold uppercase tracking-widest bg-accent/10 text-accent px-2 py-0.5 rounded-full ml-3 flex-shrink-0">{label}</span>
      </div>
      <p className="text-text-muted text-xs leading-relaxed">{description}</p>
      <div className="mt-3 flex items-center text-accent text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
        Explore <ArrowRight className="ml-1.5 h-3 w-3" />
      </div>
    </motion.div>
  );
}
