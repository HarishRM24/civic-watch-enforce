
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Phone, Mail, User, Users, 
  Calendar, AlertTriangle, ClipboardList 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getPoliceStationById, PoliceStation } from "@/services/policeStationService";

const PoliceStationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [station, setStation] = useState<PoliceStation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  
  useEffect(() => {
    const fetchStationDetails = async () => {
      if (!id) return;
      
      try {
        const data = await getPoliceStationById(id);
        setStation(data);
      } catch (error) {
        console.error("Error fetching police station details:", error);
        toast({
          title: "Error",
          description: "Failed to load police station details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStationDetails();
  }, [id, toast]);

  // Mock data for additional station information (in a real app, this would come from the database)
  const officersCount = 24;
  const establishedYear = "1998";
  const recentIncidents = 8;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-36 w-full rounded-lg" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Police Station Not Found</h2>
          <p className="text-gray-600 mb-6">The police station you are looking for does not exist or was removed.</p>
          <Link to="/police-stations">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Stations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/police-stations" className="inline-flex items-center text-police-600 hover:text-police-800 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Stations
        </Link>
        <h1 className="text-3xl font-bold text-police-800">{station.name}</h1>
        <p className="text-gray-600">{station.city}, {station.state}</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="bg-gray-100 h-64 rounded-lg mb-4 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-police-500" />
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex">
                <MapPin className="h-5 w-5 text-police-600 mr-3" />
                <span>{station.address}, {station.city}, {station.state} {station.zip_code}</span>
              </div>
              {station.phone && (
                <div className="flex">
                  <Phone className="h-5 w-5 text-police-600 mr-3" />
                  <span>{station.phone}</span>
                </div>
              )}
              {station.email && (
                <div className="flex">
                  <Mail className="h-5 w-5 text-police-600 mr-3" />
                  <a href={`mailto:${station.email}`} className="text-police-600 hover:underline">
                    {station.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Station Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-police-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Station Chief</p>
                    <p>Captain John Smith</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-police-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Officers</p>
                    <p>{officersCount}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-police-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Established</p>
                    <p>{establishedYear}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-police-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Recent Incidents</p>
                    <p>{recentIncidents} this month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {userRole === 'civilian' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">File a Complaint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  As a civilian, you can file a complaint about this police station or its officers.
                </p>
                <Link to={`/complaint/${id}`}>
                  <Button className="w-full">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    File Complaint
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoliceStationDetailPage;
