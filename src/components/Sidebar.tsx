
import { Link } from "react-router-dom";
import { Home, Users, AlertTriangle, Building2, UserRound, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
};

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Police Stations",
    href: "/police-stations",
    icon: Building2,
  },
  {
    title: "Civilian Database",
    href: "/civilian-database",
    icon: Users,
    roles: ["police"],
  },
  {
    title: "Criminal Database",
    href: "/criminal-database",
    icon: AlertTriangle,
    roles: ["police"],
  },
  {
    title: "My Profile",
    href: "/civilian-profile",
    icon: UserRound,
    roles: ["civilian"],
  },
  {
    title: "File Complaint",
    href: "/complaint/new",
    icon: ClipboardCheck,
    roles: ["civilian"],
  },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user, userRole } = useAuth();

  // Filter items based on user role
  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole))
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="lg:hidden mb-4 w-full"
          >
            Close Menu
          </Button>
          <h2 className="text-xl font-bold text-police-800">Navigation</h2>
        </div>

        <ScrollArea className="flex-1">
          <nav className="px-2 py-4">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-police-50 hover:text-police-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <p className="text-sm text-gray-500">
            Police Management System v1.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
