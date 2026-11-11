import React from "react";
import { Users, ShieldCheck, MapPin, CheckCircle2, Wrench, Cpu, Network, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminTeamPage() {
  const units = [
    {
      unitName: "Ariiti POS & Commerce Engineering Unit",
      designation: "Retail Systems & Peripheral Integration",
      specialization: "Offline-First Sync, ESC/POS Protocols, Touch Hardware",
      dispatchHubs: "Stationed at Harar Hub & Dire Dawa Center",
      keyCompetencies: [
        "Local-first indexed database architecture",
        "ESC/POS thermal printer firmware calibration",
        "Dual-screen customer display sync",
        "Barcode scanner & electronic cash drawer triggers",
      ],
    },
    {
      unitName: "Structured Cabling & Rack Infrastructure Squad",
      designation: "Physical Layer Network Engineering",
      specialization: "Cat6/Fiber Backbones, 12U-42U Racks, Fluke Certification",
      dispatchHubs: "Field Operations Unit 1 (Harar & Dire Dawa)",
      keyCompetencies: [
        "High-density patch panel termination & dressing",
        "Fluke channel link certification & attenuation testing",
        "Clean server rack layout with horizontal wire management",
        "VLAN network segmentation & MikroTik router configs",
      ],
    },
    {
      unitName: "Rapid Response IT Maintenance & Field Support",
      designation: "Enterprise SLA Incident Management",
      specialization: "2-Hour Regional Emergency Dispatch, Preventative Audits",
      dispatchHubs: "Mobile Incident Response Units stationed in Harar & Dire Dawa",
      keyCompetencies: [
        "Guaranteed 2-hour on-premise emergency arrival in core districts",
        "On-site spare hardware inventory (switches, PSUs, routers)",
        "Scheduled monthly preventive maintenance & dust cleaning",
        "Ethernet port testing and continuity verification",
      ],
    },
    {
      unitName: "Cloud Systems & Business Automation Unit",
      designation: "Custom Software Architecture & Enterprise APIs",
      specialization: "Next.js, Node.js, Distributed DBs, Inventory Engines",
      dispatchHubs: "Software Development Laboratory (Harar)",
      keyCompetencies: [
        "Custom ERP, inventory, and supply chain applications",
        "Secure REST & GraphQL API integrations",
        "Multi-branch automated data synchronization",
        "Role-based access control (RBAC) & audit logging",
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-ariiti-accent" />
            <span className="text-xs font-mono uppercase tracking-wider text-ariiti-accent font-bold">
              Engineering Roster
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Team Capabilities & Technical Squads
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational engineering squads deployed across Harar and Dire Dawa delivering specialized physical and software infrastructure.
          </p>
        </div>

        <Link
          href="/team"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
        >
          <span>View Public Team Page</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {units.map((unit, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  {unit.designation}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Active Squad
                </span>
              </div>

              <h2 className="text-base font-bold text-white mb-1">
                {unit.unitName}
              </h2>
              <p className="text-xs text-slate-400 mb-3 font-mono">
                {unit.specialization}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-teal-400 mb-4 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{unit.dispatchHubs}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Core Technical Competencies:
                </span>
                {unit.keyCompetencies.map((comp, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
