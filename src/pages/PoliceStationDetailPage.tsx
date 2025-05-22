
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ChevronLeft, Phone, Mail, MapPin, Clock, 
  User, Shield, FileText, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getPoliceStationById, getComplaints } from "@/services/dataService";

const PoliceStationDetailPage = () => {
  const { id = "" } = useParams();
  const { user, userRole } = useAuth();
  
  const { data: station, isLoading: isLoadingStation } = useQuery({
    queryKey: ["policeStation", id],
    queryFn: () => getPoliceStationById(id),
    enabled: !!id
  });
  
  const { data: complaints } = useQuery({
    queryKey: ["complaints", id],
    queryFn: () => getComplaints(),
    enabled: !!id && userRole === "police"
  });

  if (isLoadingStation) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-police-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading police station details...</p>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">Police station not found</p>
        <Link to="/police-stations">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Stations
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">{station.name}</h1>
            <Link to="/police-stations">
              <Button variant="outline" className="bg-white hover:bg-gray-100">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Stations
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Station Information</CardTitle>
                <CardDescription>Basic details about the police station</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{station.area}</p>
                    <p className="text-gray-600">{station.city}, {station.state}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                  <div>
                    <p className="font-medium">Contact Number</p>
                    <p className="text-gray-600">{station.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                  <div>
                    <p className="font-medium">Operating Hours</p>
                    <p className="text-gray-600">24 hours / 7 days a week</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                  <div>
                    <p className="font-medium">Jurisdiction</p>
                    <p className="text-gray-600">{station.area} and surrounding regions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="officers">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="officers">Officers On Duty</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>
              
              <TabsContent value="officers" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Station Personnel</CardTitle>
                    <CardDescription>
                      {station.officers.length} officer{station.officers.length !== 1 ? 's' : ''} currently on duty
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {station.officers.map((officer) => (
                        <div key={officer.id} className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarFallback className="bg-police-500 text-white">
                              {officer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <h3 className="font-medium">{officer.name}</h3>
                              <span className="text-sm text-police-600 bg-police-50 px-2 py-1 rounded-full">
                                {officer.rank}
                              </span>
                            </div>
                            
                            <div className="mt-2 text-sm text-gray-500 space-y-1">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                {officer.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                {officer.phoneNumber}
                              </div>
                            </div>
                            
                            {userRole === "civilian" && (
                              <div className="mt-3">
                                <Link to={`/complaint/${officer.id}`}>
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-2" />
                                    File Complaint
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Services</CardTitle>
                    <CardDescription>Services provided at this police station</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-police-500 mr-3" />
                        <span>FIR Registration</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-police-500 mr-3" />
                        <span>Complaint Registration</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-police-500 mr-3" />
                        <span>Lost & Found</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-police-500 mr-3" />
                        <span>Character Verification</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-police-500 mr-3" />
                        <span>Tenant Verification</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-police-500 mr-3" />
                        <span>Emergency Response</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                  <Phone className="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <p className="text-xl font-bold text-red-600">100</p>
                  <p className="text-sm text-gray-600 mt-2">
                    For emergencies only
                  </p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Station direct line:</p>
                  <p className="font-medium">{station.phoneNumber}</p>
                </div>
              </CardContent>
            </Card>
            
            {userRole === "police" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Complaints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {complaints && complaints.length > 0 ? (
                    <div className="space-y-3">
                      {complaints
                        .filter(complaint => 
                          station.officers.some(officer => officer.id === complaint.officerId)
                        )
                        .map((complaint) => (
                          <div key={complaint.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-600">
                              {new Date(complaint.timestamp).toLocaleDateString()}
                            </p>
                            <p className="mt-1">{complaint.text}</p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No complaints registered for officers at this station.</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceStationDetailPage;
