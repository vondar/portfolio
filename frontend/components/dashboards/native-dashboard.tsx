"use client";

import { AttentionDashboard } from "./attention-dashboard";
import { CricAuditDashboard } from "./cricaudit-dashboard";
import { F2PDashboard } from "./f2p-dashboard";
import { NostalgiaDashboard } from "./nostalgia-dashboard";


export function NativeDashboard({ slug }: { slug: string }) {
  if (slug === "cricaudit") return <CricAuditDashboard />;
  if (slug === "f2p-games") return <F2PDashboard />;
  if (slug === "attention-deficit") return <AttentionDashboard />;
  if (slug === "nostalgia") return <NostalgiaDashboard />;
  return null;
}
