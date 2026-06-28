"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProjectDetails } from "@/data/projects";
import { useStore } from "@/store/useStore";
import { X, Cpu, Clipboard, Check, Terminal, Settings2 } from "lucide-react";

interface ProjectModalProps {
  project: ProjectDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "overview" | "features" | "architecture" | "install";

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { role } = useStore();

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
      // Add keyboard Esc shortcut
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  // Handle code block copy
  const handleCopy = (textArray: string[]) => {
    const textToCopy = textArray.join("\n");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Key Features" },
    { id: "architecture", label: "Architecture" },
    { id: "install", label: "Setup & Run" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl rounded-xl border border-border-color bg-bg-secondary p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Decorative elements */}
        <div className="cognitive-decor absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent to-accent-pink" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border-color pb-4 mb-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-accent-pink tracking-[0.2em] uppercase">
              {project.category} // PROJECT_CORE
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary uppercase">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-bg-primary border border-border-color transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-text-secondary hover:text-text-primary" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border-color/50 mb-6 gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all rounded-md flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-accent/15 border border-accent/40 text-accent font-bold shadow-[0_0_8px_rgba(0,243,255,0.05)]"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1 text-sm leading-relaxed space-y-4">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2">
                  System Abstract
                </h3>
                <p className="text-text-primary font-medium text-[15px]">
                  {project.shortDesc[role] || project.shortDesc.general}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-3">
                  Applied Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="font-mono text-xs text-accent border border-accent/25 bg-accent/5 px-2.5 py-1 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Persona Context Specs */}
              <div className="rounded-lg bg-bg-primary/50 border border-border-color/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4 text-accent" />
                  <span className="font-mono text-xs font-semibold uppercase text-text-primary">
                    Active System Metric ({role})
                  </span>
                </div>
                <div className="font-mono text-xs text-text-secondary flex items-center justify-between">
                  <span>METRIC_RATING:</span>
                  <span className="text-accent-pink font-bold uppercase">
                    {project.metrics[role] || project.metrics.general}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-3">
              <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2">
                Operational Capabilities
              </h3>
              <ul className="space-y-3">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-5 w-5 flex-shrink-0 flex items-center justify-center rounded bg-accent/10 border border-accent/30 text-accent font-mono text-[10px] mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-text-primary text-[14px]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2">
                Structural Topology
              </h3>
              <div className="space-y-3">
                {project.architecture.map((arch, i) => (
                  <div
                    key={i}
                    className="border border-border-color/40 bg-bg-primary/20 rounded-lg p-3 flex gap-3 items-start"
                  >
                    <Settings2 className="h-4 w-4 mt-0.5 text-accent-pink flex-shrink-0" />
                    <div>
                      <span className="font-mono text-xs text-text-primary font-bold block mb-1">
                        NODE_0{i + 1} // {arch.split(":")[0]}
                      </span>
                      <span className="text-text-secondary text-[13px]">
                        {arch.split(":")[1] || arch}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "install" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-accent" />
                  Terminal Commands
                </h3>
                <button
                  onClick={() => handleCopy(project.installation)}
                  className="flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-text-primary transition-colors border border-border-color px-2.5 py-1 rounded bg-bg-primary/30"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-accent" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-3.5 w-3.5" />
                      Copy Instructions
                    </>
                  )}
                </button>
              </div>

              {/* Code display block */}
              <div className="rounded-lg bg-black border border-border-color p-4 font-mono text-xs text-emerald-400 overflow-x-auto space-y-1 max-h-[350px]">
                {project.installation.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-600 select-none">$</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-border-color pt-4 mt-4 flex justify-between items-center text-xs font-mono text-text-secondary">
          <span>PORTFOLIO_LEDGER_REPLY // OK</span>
          <span>SYSTEM_STATE_NORMAL</span>
        </div>
      </div>
    </div>
  );
}
