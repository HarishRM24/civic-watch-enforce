
import { Link } from "react-router-dom";
import { Shield, Users, AlertTriangle, Building2, UserRound, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const HomePage = () => {
  const { user, userRole } = useAuth();

  const features = [
    {
      title: "Police Stations",
      description: "Find and get information about police stations in your area",
      icon: Building2,
      href: "/police-stations",
      color: "bg-police-50 border-police-200"
    },
    {
      title: "Civilian Database",
      description: "Access civilian records and information (Police Only)",
      icon: Users,
      href: "/civilian-database",
      color: "bg-blue-50 border-blue-200",
      restricted: "police"
    },
    {
      title: "Criminal Database",
      description: "View criminal records and case information (Police Only)",
      icon: AlertTriangle,
      href: "/criminal-database",
      color: "bg-red-50 border-red-200",
      restricted: "police"
    },
    {
      title: "My Profile",
      description: "View and update your personal information",
      icon: UserRound,
      href: "/civilian-profile",
      color: "bg-green-50 border-green-200",
      restricted: "civilian"
    },
    {
      title: "File Complaint",
      description: "Submit complaints about police officers or stations",
      icon: ClipboardCheck,
      href: "/complaint/new",
      color: "bg-amber-50 border-amber-200",
      restricted: "civilian"
    }
  ];

  const filteredFeatures = features.filter(feature => 
    !feature.restricted || feature.restricted === userRole
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Shield className="h-24 w-24 text-police-600" />
        </div>
        <h1 className="text-4xl font-bold text-police-800 mb-4">
          Police Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A comprehensive platform for managing police operations, civilian records, 
          and community interactions with enhanced security and efficiency.
        </p>
        
        {!user && (
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-police-600 hover:bg-police-700">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {filteredFeatures.map((feature) => (
          <Card key={feature.title} className={`${feature.color} transition-all hover:shadow-md`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <feature.icon className="h-8 w-8 text-police-600" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={feature.href}>
                <Button variant="outline" className="w-full">
                  Access Feature
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Welcome Message for Logged-in Users */}
      {user && userRole && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-police-800 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600">
            You are logged in as a <span className="font-semibold capitalize">{userRole}</span>.
            Use the navigation menu or the cards above to access your features.
          </p>
        </div>
      )}

      {/* Statistics Section */}
      <div className="grid gap-4 md:grid-cols-3 mt-12">
        <div className="bg-police-100 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-police-800">24/7</h3>
          <p className="text-police-600">Emergency Response</p>
        </div>
        <div className="bg-police-100 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-police-800">100+</h3>
          <p className="text-police-600">Police Stations</p>
        </div>
        <div className="bg-police-100 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-police-800">Secure</h3>
          <p className="text-police-600">Data Management</p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-12 text-center py-6 border-t border-gray-200">
        <p className="text-gray-600">
          © 2024 E-governance Jth component. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
