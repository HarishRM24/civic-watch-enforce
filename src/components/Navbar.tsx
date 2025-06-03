
import { Link } from "react-router-dom";
import { Menu, Shield, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ setIsSidebarOpen }: NavbarProps) => {
  const { user, userProfile, logout } = useAuth();

  // Improved display name logic with better fallback
  const getDisplayName = () => {
    // First priority: display_name from profile
    if (userProfile?.display_name && userProfile.display_name.trim() !== '') {
      return userProfile.display_name;
    }
    
    // Second priority: email username part
    if (user?.email) {
      const emailUsername = user.email.split('@')[0];
      // Make it more readable by capitalizing first letter
      return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
    }
    
    // Fallback
    return 'User';
  };

  const displayName = getDisplayName();

  const handleMenuToggle = () => {
    console.log('Menu button clicked, current sidebar state will toggle'); // Debug log
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      console.log('Sidebar state changing from', prev, 'to', newState); // Debug log
      return newState;
    });
  };

  return (
    <header className="bg-police-800 text-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleMenuToggle}
            className="text-white hover:bg-police-700 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8" />
            <span className="text-xl font-bold hidden sm:inline">Police Management System</span>
            <span className="text-xl font-bold sm:hidden">PMS</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline-block text-sm">
                Welcome, {displayName}!
              </span>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-police-500 text-white text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="text-white hover:bg-police-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-police-700">
                <LogIn className="h-4 w-4 mr-2" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
