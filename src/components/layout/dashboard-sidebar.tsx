/* eslint-disable no-restricted-globals */
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { devLog } from "@/util/logger";
import {
  Activity,
  ChevronDown,
  ChevronLeft,
  Droplets,
  HeartPulse,
  HelpingHand,
  LayoutDashboard,
  Repeat,
  Settings,
  UserRoundCog,
  Users2Icon,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface DashboardSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const communitySidebarNavItems = [
  {
    type: "item",
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },

  {
    type: "heading",
    title: "Blood Need Management",
  },

  {
    type: "item",
    title: "Blood Needs",
    href: "/community/blood-needs",
    icon: HeartPulse,
  },
  {
    type: "item",
    title: "Donors",
    icon: HelpingHand,
    href: "community/donors",
    items: [],
  },

  {
    type: "heading",
    title: "Events Mangement",
  },
  {
    type: "item",
    title: "Events",
    icon: UserRoundCog,
    href: "/community/events",
    items: [],
  },

  {
    type: "heading",
    title: "Settings",
  },
  {
    type: "item",
    title: "Staffs",
    icon: Users2Icon,
    href: "/staffs",
    items: [],
  },

  {
    type: "item",
    title: "Settings",
    icon: Settings,
    href: "/settings",
    items: [],
  },

  {
    type: "heading",
    title: "Logs",
  },

  {
    type: "item",
    title: "Activity Logs",
    href: "/activity-logs",
    icon: Activity,
  },
];

const bloodBankSidebarNavItems = [
  {
    type: "item",
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    type: "heading",
    title: "User Management",
  },
  {
    type: "item",
    title: "Staffs",
    icon: Users2Icon,
    href: "/staffs",
    items: [],
  },

  {
    type: "item",
    title: "Admins",
    icon: UserRoundCog,
    href: "/admins",
    items: [],
  },

  {
    type: "heading",
    title: "Food Stock",
  },

  {
    type: "item",
    title: "Food Stocks",
    href: "/blood-stocks",
    icon: Utensils,
  },

  {
    type: "item",
    title: "Transfers",
    href: "/blood-transfers",
    icon: Repeat,
  },

  {
    type: "heading",
    title: "Settings",
  },
  {
    type: "item",
    title: "Settings",
    icon: Settings,
    href: "/settings",
    items: [],
  },

  {
    type: "heading",
    title: "Logs",
  },

  {
    type: "item",
    title: "Activity Logs",
    href: "/activity-logs",
    icon: Activity,
  },
];

export function DashboardSidebar({
  open,
  onOpenChange,
}: DashboardSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  devLog(user?.organizerProfile?.type, "ususuusususer");

  const NavItem = ({ item, collapsed }: { item: any; collapsed: boolean }) => {
    if (item.items?.length) {
      return (
        <SidebarSubmenu
          key={item.title}
          icon={item.icon}
          title={item.title}
          items={item.items}
          isCollapsed={collapsed}
        />
      );
    }

    const LinkContent = (
      <Link
        to={item.href!}
        className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold shadow-sm bg-white/70 hover:bg-orange-100 hover:shadow-md transition-all duration-200 border border-transparent hover:border-orange-300",
          (item.href === "/"
            ? location.pathname === "/"
            : location.pathname.includes(item.href) &&
              location.pathname !== "/") && "bg-orange-200 text-orange-900 border-orange-400",
          !open && "justify-center px-2 text-lg"
        )}
        style={{ fontFamily: 'Quicksand, sans-serif' }}
      >
        {item.icon && (
          <item.icon className={cn("h-5 w-5", !open && "w-6 h-6")}/>
        )}
        {open && (
          <span className="transition-all duration-300">{item.title}</span>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <TooltipProvider key={item.title}>
          <Tooltip>
            <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              className="flex items-center gap-2"
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return LinkContent;
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background shadow-xl duration-300 ease-in-out mt-[3.5rem] rounded-tr-3xl rounded-br-3xl",
        open ? "w-[16rem]" : "w-[4rem]"
      )}
    >
      <div className="flex items-center justify-center py-6">
        <div className="bg-white rounded-full shadow-lg flex items-center justify-center w-16 h-16 border-4 border-border">
          <span className="text-3xl font-bold text-primary" style={{ fontFamily: 'Quicksand, sans-serif' }}>🍽️</span>
        </div>
      </div>
      <div className="border-b px-4 py-2">
        <div className="flex items-center justify-between">
          {open && (
            <span className="font-extrabold text-lg text-foreground transition-all duration-300" style={{ fontFamily: 'Quicksand, sans-serif', letterSpacing: 1 }}>
              Menu
            </span>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="space-y-2">
          {(user?.organizerProfile?.type === "Blood Bank"
            ? bloodBankSidebarNavItems
            : communitySidebarNavItems
          ).map((item, index) => {
            if (item.type === "heading") {
              return open ? (
                <div key={index} className="flex items-center gap-2 px-3 pt-5">
                  <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    {item.title}
                  </span>
                  <div className="h-[1px] flex-1 bg-border" />
                </div>
              ) : null;
            }
            if (item.type === "item") {
              return <NavItem key={index} item={item} collapsed={!open} />;
            }
            return null;
          })}
        </nav>
      </ScrollArea>
      <div className="bg-muted/80 flex justify-end rounded-bl-3xl">
        <Button
          size="icon"
          className={cn(
            "transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md",
            !open && "rotate-180 w-full"
          )}
          onClick={() => onOpenChange?.(!open)}
        >
          <ChevronLeft size={20} className="h-10 w-10 font-bold" />
        </Button>
      </div>
    </div>
  );
}

interface SidebarSubmenuProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  items: {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  isCollapsed?: boolean;
}

function SidebarSubmenu({
  icon: Icon,
  title,
  items,
  isCollapsed,
}: SidebarSubmenuProps) {
  const location = useLocation();
  const [open, setOpen] = useState(
    items.some((item) => location.pathname === item.href)
  );

  if (isCollapsed) {
    return (
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <Button variant="ghost" className="w-full justify-center px-2 py-2">
            {Icon && <Icon className="h-5 w-5" />}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent
          side="right"
          className="w-48 p-2"
          align="start"
          alignOffset={-4}
        >
          <div className="mb-2 px-2 py-1.5">
            <h4 className="text-sm font-medium">{title}</h4>
          </div>
          <div className="space-y-1">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href &&
                    "bg-accent text-accent-foreground"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-4 w-4" />}
            <span className="transition-all duration-300">{title}</span>
          </div>
          <ChevronDown
            className={cn("h-4 w-4 transition-all", open && "rotate-180")}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 mt-1 space-y-1">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href &&
                    "bg-accent text-accent-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.title}
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
