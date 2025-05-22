
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Map, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPoliceStations } from "@/services/dataService";

const PoliceStationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: stations, isLoading, error } = useQuery({
    queryKey: ["policeStations"],
    queryFn: getPoliceStations
  });

  const filteredStations = stations?.filter((station) => {
    const query = searchQuery.toLowerCase();
    return (
      station.name.toLowerCase().includes(query) ||
      station.area.toLowerCase().includes(query) ||
      station.city.toLowerCase().includes(query) ||
      station.state.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Police Stations</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="mb-8 bg-white p-4 rounded-lg shadow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredStations ? `${filteredStations.length} stations found` : "Loading stations..."}
            </p>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Map className="h-4 w-4 mr-2" />
                View Map
              </Button>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading && (
          <div className="text-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-police-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading police stations...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center p-8 text-red-500">
            <p>Error loading police stations. Please try again later.</p>
          </div>
        )}
        
        {filteredStations && filteredStations.length === 0 && (
          <div className="text-center p-8">
            <p className="text-lg text-gray-500">No police stations found matching your search.</p>
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStations?.map((station) => (
            <Link to={`/police-stations/${station.id}`} key={station.id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-police-700">{station.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-600">{station.area}</p>
                        <p className="text-gray-600">{station.city}, {station.state}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                      <p className="text-gray-600">{station.phoneNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">
                        {station.officers.length} officer{station.officers.length !== 1 ? 's' : ''} on duty
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoliceStationsPage;
