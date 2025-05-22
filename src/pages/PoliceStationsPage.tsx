
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getPoliceStations, searchPoliceStations, PoliceStation } from "@/services/policeStationService";

const PoliceStationsPage = () => {
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<PoliceStation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await getPoliceStations();
        setStations(data);
        setFilteredStations(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading police stations:", error);
        toast({
          title: "Error",
          description: "Failed to load police station data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadStations();
  }, [toast]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredStations(stations);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchPoliceStations(searchQuery);
      setFilteredStations(results);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search police stations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-police-800 mb-6">Police Stations</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredStations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No police stations found matching your search.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("");
              setFilteredStations(stations);
            }}
            className="mt-4"
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStations.map((station) => (
            <Card key={station.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-police-700">{station.name}</CardTitle>
                <p className="text-sm text-gray-500">{station.city}, {station.state}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-police-600 mr-2 mt-0.5" />
                    <span>{station.address}, {station.city}, {station.state} {station.zip_code}</span>
                  </div>
                  {station.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-police-600 mr-2" />
                      <span>{station.phone}</span>
                    </div>
                  )}
                  {station.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-police-600 mr-2" />
                      <span className="truncate">{station.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/police-stations/${station.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoliceStationsPage;
