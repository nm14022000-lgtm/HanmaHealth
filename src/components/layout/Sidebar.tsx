import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Dumbbell,
  Salad,
  Droplets,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TabKey = "home" | "workouts" | "nutrition" | "hydration" | "progress" | "profile";

const NAV_ITEMS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "home", label: "Dashboard", icon: LayoutDashboard },
  { key: "workouts", label: "Workouts", icon: Dumbbell },
  { key: "nutrition", label: "Nutrition", icon: Salad },
  { key: "hydration", label: "Hydration", icon: Droplets },
  { key: "progress", label: "Progress", icon: TrendingUp },
  { key: "profile", label: "Profile", icon: UserCircle },
];

interface SidebarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden md:flex md:flex-col md:w-[240px] md:h-screen md:shrink-0 z-40"
        style={{
          background: "linear-gradient(180deg, rgba(15,18,24,0.95) 0%, rgba(11,12,16,0.98) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-[72px] shrink-0 border-b border-border/60">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              boxShadow: "0 0 16px rgba(34,197,94,0.35)",
            }}
          >
            <Dumbbell className="w-4 h-4 text-black" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-text-primary">Hanma</span>
            <span className="block text-[0.6rem] text-text-muted tracking-widest uppercase font-medium">Health</span>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1 px-3 pt-4 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.key}
              item={item}
              active={active === item.key}
              onClick={() => onChange(item.key)}
            />
          ))}
        </div>

        {/* Bottom user area */}
        <div className="px-3 pb-6 pt-2 border-t border-border/60 mt-2">
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white/[0.03]"
          >
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-black"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
            >
              R
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">My Profile</p>
              <p className="text-[0.6rem] text-text-muted truncate">Track · Improve · Grow</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sticky top bar */}
      <nav className="md:hidden sticky top-0 z-40 flex items-center gap-0.5 overflow-x-auto px-2 h-[56px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          background: "rgba(11,12,16,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <MobileNavButton
            key={item.key}
            item={item}
            active={active === item.key}
            onClick={() => onChange(item.key)}
          />
        ))}
      </nav>
    </>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: { key: TabKey; label: string; icon: React.ElementType };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group",
        active
          ? "text-primary"
          : "text-text-muted hover:text-text-primary"
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 rounded-xl"
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.18)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {/* Active left accent bar */}
      {active && (
        <motion.div
          layoutId="sidebar-active-bar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        className={cn(
          "relative z-10 w-4.5 h-4.5 transition-colors shrink-0",
          active ? "text-primary" : "text-text-muted group-hover:text-text-secondary"
        )}
        size={18}
      />
      <span className="relative z-10 tracking-tight">{item.label}</span>
    </button>
  );
}

function MobileNavButton({
  item,
  active,
  onClick,
}: {
  item: { key: TabKey; label: string; icon: React.ElementType };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 min-w-[56px] h-full px-1.5 text-[0.58rem] font-medium transition-colors",
        active ? "text-primary" : "text-text-muted"
      )}
    >
      {active && (
        <motion.div
          layoutId="mobile-active-bg"
          className="absolute inset-x-1 inset-y-2 rounded-lg"
          style={{ background: "rgba(34,197,94,0.08)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="relative z-10 w-[1.1rem] h-[1.1rem]" />
      <span className="relative z-10 whitespace-nowrap">{item.label}</span>
    </button>
  );
}
