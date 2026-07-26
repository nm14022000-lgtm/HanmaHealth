import { motion } from "framer-motion";
import { Home, Dumbbell, Apple, Droplet, TrendingUp, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabKey = "home" | "workouts" | "nutrition" | "hydration" | "progress" | "profile";

const NAV_ITEMS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "home", label: "Dashboard", icon: Home },
  { key: "workouts", label: "Workouts", icon: Dumbbell },
  { key: "nutrition", label: "Nutrition", icon: Apple },
  { key: "hydration", label: "Hydration", icon: Droplet },
  { key: "progress", label: "Progress", icon: TrendingUp },
  { key: "profile", label: "Profile", icon: User },
];

interface SidebarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex md:flex-col md:w-[260px] md:h-screen md:sticky md:top-0 border-r border-border bg-bg-surface/60 backdrop-blur-md px-6 py-8 justify-between z-40">
        <div>
          <div className="flex items-center gap-2 mb-10 px-1">
            <Dumbbell className="text-primary w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">Hanma Gym</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <NavButton key={item.key} item={item} active={active === item.key} onClick={() => onChange(item.key)} vertical />
            ))}
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 border border-border rounded-xl py-2.5 text-text-muted hover:text-secondary hover:border-secondary/40 transition-colors text-xs font-bold">
          <Shield className="w-4 h-4" /> DEMON MODE
        </button>
      </nav>

      {/* Mobile sticky top bar — deliberately position:sticky (not fixed).
          Many in-app WebViews (Telegram, etc.) render position:fixed
          unreliably, sometimes pinning it to the wrong edge or overlapping
          content. Sticky stays in normal document flow so it can never
          overlap the page content beneath it. */}
      <nav className="md:hidden sticky top-0 z-40 flex items-center gap-1 overflow-x-auto bg-bg-surface/90 backdrop-blur-md border-b border-border px-2 h-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.key} item={item} active={active === item.key} onClick={() => onChange(item.key)} vertical={false} />
        ))}
      </nav>
    </>
  );
}

function NavButton({
  item,
  active,
  onClick,
  vertical,
}: {
  item: { key: TabKey; label: string; icon: React.ElementType };
  active: boolean;
  onClick: () => void;
  vertical: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded-xl transition-colors text-sm font-bold",
        vertical ? "px-4 py-3 w-full" : "flex-col justify-center gap-1 min-w-[64px] h-full px-2 text-[0.6rem]",
        active ? "text-primary" : "text-text-muted hover:text-text-primary"
      )}
    >
      {active && (
        <motion.div
          layoutId={vertical ? "sidebar-active-bg" : "mobile-active-bg"}
          className={cn(
            "absolute inset-0 bg-primary/10 border border-primary/30",
            vertical ? "rounded-xl" : "rounded-lg"
          )}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className={cn("relative z-10", vertical ? "w-5 h-5" : "w-[1.15rem] h-[1.15rem]")} />
      <span className="relative z-10 whitespace-nowrap">{item.label}</span>
    </button>
  );
}
