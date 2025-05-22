
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, Users, AlertTriangle, 
  ClipboardCheck, ArrowRight, Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const HomePage = () => {
  const { user, userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto">
      <section className="mb-12 text-center">
        <h1 className="police-title mb-4">Police Management System</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          A comprehensive system for managing police stations, civilian records, and criminal databases.
        </p>
        
        {!user && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-police-700 hover:bg-police-800">
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
      </section>

      {user && (
        <section className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-police-700 mb-4">Welcome, {user.displayName || user.email}</h2>
            <p className="text-gray-600 mb-6">
              {userRole === 'police' 
                ? "Access police resources, view civilian and criminal databases, and manage your station."
                : "Find information about police stations, file complaints, and manage your profile."}
            </p>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for stations, people, or resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="section-title">Quick Access</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Building2 className="h-8 w-8 text-police-600 mb-2" />
              <CardTitle>Police Stations</CardTitle>
              <CardDescription>
                View and search all police stations across the country
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Access contact information, location details, and officer information for all registered police stations.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/police-stations" className="w-full">
                <Button className="w-full" variant="outline">
                  View Stations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {userRole === 'police' && (
            <>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-police-600 mb-2" />
                  <CardTitle>Civilian Database</CardTitle>
                  <CardDescription>
                    Access and manage civilian records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    View civilian information, update records, and check status information.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/civilian-database" className="w-full">
                    <Button className="w-full" variant="outline">
                      Access Database
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <AlertTriangle className="h-8 w-8 text-police-600 mb-2" />
                  <CardTitle>Criminal Database</CardTitle>
                  <CardDescription>
                    Review criminal records and cases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Access criminal profiles, case histories, and related information.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/criminal-database" className="w-full">
                    <Button className="w-full" variant="outline">
                      View Records
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </>
          )}

          {userRole === 'civilian' && (
            <>
              <Card>
                <CardHeader>
                  <ClipboardCheck className="h-8 w-8 text-police-600 mb-2" />
                  <CardTitle>File Complaint</CardTitle>
                  <CardDescription>
                    Submit complaints about police officers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    File a formal complaint about police misconduct or service issues.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/complaint/new" className="w-full">
                    <Button className="w-full" variant="outline">
                      File Complaint
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-police-50 p-6 rounded-lg border border-police-100">
          <h2 className="text-xl font-semibold text-police-800 mb-4">About the Police Management System</h2>
          <p className="text-gray-700 mb-4">
            Our Police Management System provides a centralized platform for law enforcement agencies 
            and civilians to access essential services and information.
          </p>
          <p className="text-gray-700">
            The system enables efficient management of police stations, streamlines civilian interactions 
            with law enforcement, and ensures transparency in police operations.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
