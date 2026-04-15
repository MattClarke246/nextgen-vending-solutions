/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Scene } from './components/Scene';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Zap, 
  RefreshCw, 
  Settings, 
  Cpu, 
  ArrowRight,
  ChevronDown,
  Palette,
  Package,
  MousePointer2
} from 'lucide-react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [customization, setCustomization] = useState<{
    brandColor: string;
    productType: 'drinks' | 'snacks' | 'mixed';
  }>({
    brandColor: '#fdfdfd',
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
    <div ref={containerRef} className="relative bg-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full px-6 lg:px-16 py-10 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-2.5 font-extrabold text-xl tracking-[0.2em] uppercase pointer-events-auto">
          NEXTGEN<span className="text-accent">•</span>VENDING
        </div>
        <ul className="hidden md:flex gap-8 text-[13px] uppercase tracking-widest text-text-muted pointer-events-auto">
          <li className="hover:text-[#1d1d1f] cursor-pointer transition-colors">Services</li>
          <li className="hover:text-[#1d1d1f] cursor-pointer transition-colors">Solutions</li>
          <li className="hover:text-[#1d1d1f] cursor-pointer transition-colors">Clients</li>
          <li className="hover:text-[#1d1d1f] cursor-pointer transition-colors">Support</li>
        </ul>
      </nav>

      {/* 3D Scene Background */}
      <Scene scrollProgress={smoothProgress} customization={customization} />

      {/* Customization UI Overlay */}
      <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-4 items-end">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-2xl w-64 space-y-6"
          >
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-4">
              <Palette className="h-4 w-4" /> Customization
            </div>
            
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-wider text-text-muted">Machine Finish</Label>
              <div className="flex gap-2">
                {['#fdfdfd', '#f5f5f7', '#e5e5ea', '#1d1d1f'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setCustomization(prev => ({ ...prev, brandColor: color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${customization.brandColor === color ? 'border-accent scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-wider text-text-muted">Product Mix</Label>
              <div className="grid grid-cols-1 gap-2">
                {(['drinks', 'snacks', 'mixed'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={customization.productType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCustomization(prev => ({ ...prev, productType: type }))}
                    className={`justify-start h-9 text-[11px] uppercase tracking-wider ${customization.productType === type ? 'bg-accent text-accent-foreground' : 'border-border'}`}
                  >
                    <Package className="mr-2 h-3 w-3" /> {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-[10px] text-text-muted italic">
                <MousePointer2 className="h-3 w-3" /> Click machine to open
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sections - ensure they don't block clicks to the background canvas */}
      <section className="relative h-screen flex items-center px-6 lg:px-16 z-10 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="badge-sleek mb-6">
              The Future of Automated Retail
            </span>
            <h1 className="text-6xl lg:text-[64px] font-bold tracking-[-0.03em] leading-[1.1] mb-6 text-gradient">
              Managed Solutions <br />
              for Modern Spaces.
            </h1>
            <p className="text-lg text-text-muted mb-10 max-w-md leading-relaxed">
              From smart restocks to autonomous maintenance, we provide fully managed vending ecosystems for high-growth businesses.
            </p>
            
            <div className="flex gap-10 mt-10">
              <div className="border-l-2 border-accent pl-4">
                <div className="text-sm font-bold">99.8%</div>
                <div className="text-[11px] text-text-muted uppercase tracking-wider">Uptime Guarantee</div>
              </div>
              <div className="border-l-2 border-accent pl-4">
                <div className="text-sm font-bold">IoT Ready</div>
                <div className="text-[11px] text-text-muted uppercase tracking-wider">Smart Monitoring</div>
              </div>
              <div className="border-l-2 border-accent pl-4">
                <div className="text-sm font-bold">24hr</div>
                <div className="text-[11px] text-text-muted uppercase tracking-wider">Service Response</div>
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

      {/* Services Section */}
      <section className="relative min-h-screen py-32 px-6 lg:px-16 z-10 pointer-events-none">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-12 tracking-tight">
                Premium <span className="text-accent neon-glow">Services</span>
              </h2>
              
              <div className="space-y-6">
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
        </div>
      </section>

      {/* Exploded View Section */}
      <section className="relative min-h-screen py-32 px-6 lg:px-16 z-10 pointer-events-none">
        <div className="text-center mb-32 pointer-events-auto">
          <motion.h2 
            className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Engineered for <span className="text-accent neon-glow">Excellence</span>
          </motion.h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Our machines are built with cutting-edge technology and precision components to deliver a seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-48 pointer-events-auto">
          <FeatureCard 
            title="Internal Systems"
            label="Maintenance"
            description="High-efficiency cooling and mechanical delivery systems designed for longevity."
          />
          <FeatureCard 
            title="Mechanical Parts"
            label="Repairs"
            description="Modular components that allow for rapid repair and minimal service interruption."
          />
          <FeatureCard 
            title="Smart Tech"
            label="Upgrades"
            description="Integrated payment systems and digital interfaces that evolve with technology."
          />
        </div>
      </section>

      {/* Booking Section */}
      <section className="relative min-h-screen py-32 px-6 lg:px-16 z-10 flex items-center justify-center pointer-events-none">
        <div className="side-panel-card w-full max-w-2xl pointer-events-auto">
          <div className="mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Book Your Setup</h2>
            <p className="text-text-muted text-sm">Schedule a consultation for custom hardware and managed replenishment services.</p>
          </div>
          
          <form className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="business" className="text-[11px] uppercase tracking-wider text-text-muted">Business Name</Label>
                <Input id="business" placeholder="Enter company name" className="bg-black/5 border-border focus:border-accent h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service" className="text-[11px] uppercase tracking-wider text-text-muted">Service Type</Label>
                <Select>
                  <SelectTrigger className="bg-black/5 border-border h-12">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border text-[#1d1d1f]">
                    <SelectItem value="install">Hardware Installation</SelectItem>
                    <SelectItem value="inventory">Restocking & Managed Inventory</SelectItem>
                    <SelectItem value="branding">Custom Branding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] uppercase tracking-wider text-text-muted">Contact Email</Label>
              <Input id="email" type="email" placeholder="name@company.com" className="bg-black/5 border-border focus:border-accent h-12" />
            </div>

            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-14 text-sm font-bold uppercase tracking-widest mt-4">
              Schedule Service
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 lg:px-16 z-10 border-t border-border pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="font-bold text-lg tracking-widest uppercase">NEXTGEN SOLUTIONS</div>
          </div>
          <div className="flex gap-8 text-[11px] text-text-muted uppercase tracking-wider">
            <div>LONDON / NYC / TOKYO</div>
            <div>© 2024 NEXTGEN SOLUTIONS</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      className="flex gap-6 p-6 rounded-2xl transition-all hover:bg-black/5 group border border-transparent hover:border-border"
      whileHover={{ x: 10 }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
        <p className="text-text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({ title, label, description }: { title: string, label: string, description: string }) {
  return (
    <motion.div 
      className="glass p-8 rounded-2xl relative overflow-hidden group"
      whileHover={{ y: -10 }}
    >
      <div className="absolute top-0 right-0 p-5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent/50">{label}</span>
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center text-accent text-[11px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
        Explore <ArrowRight className="ml-2 h-3 w-3" />
      </div>
    </motion.div>
  );
}
