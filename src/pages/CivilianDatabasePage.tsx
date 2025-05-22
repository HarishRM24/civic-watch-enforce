
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, User, AlertTriangle, Users, UserCheck, 
  Filter, Download, Shield 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCivilians } from "@/services/dataService";

const CivilianDatabasePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCriminals, setShowCriminals] = useState(false);
  
  const { data: civilians, isLoading } = useQuery({
    queryKey: ["civilians"],
    queryFn: getCivilians
  });

  const filteredCivilians = civilians?.filter((civilian) => {
    const query = searchQuery.toLowerCase();
    
    // Filter by criminal status if needed
    if (showCriminals && !civilian.isCriminal) {
      return false;
    }
    
    // Filter by search query
    return (
      civilian.name.toLowerCase().includes(query) ||
      civilian.email.toLowerCase().includes(query) ||
      civilian.address.city.toLowerCase().includes(query) ||
      civilian.address.state.toLowerCase().includes(query) ||
      (civilian.job && civilian.job.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Civilian Database</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card className="md:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Search Database</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, email, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="mt-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCriminals}
                    onChange={() => setShowCriminals(!showCriminals)}
                    className="h-4 w-4 text-police-600 focus:ring-police-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show criminals only</span>
                </label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Database Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Civilians</p>
                    <p className="text-xl font-semibold">{civilians?.length || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Clear Status</p>
                    <p className="text-xl font-semibold">
                      {civilians?.filter(c => !c.isCriminal).length || 0}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Criminal Records</p>
                    <p className="text-xl font-semibold">
                      {civilians?.filter(c => c.isCriminal).length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {isLoading ? (
          <div className="text-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-police-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading civilian database...</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCivilians?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No civilians found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCivilians?.map((civilian) => (
                      <TableRow key={civilian.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            {civilian.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{civilian.email}</div>
                            <div className="text-gray-500">{civilian.phoneNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{civilian.address.city}</div>
                            <div className="text-gray-500">{civilian.address.state}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {civilian.job || "N/A"}
                          {civilian.salary && (
                            <div className="text-sm text-gray-500">
                              ₹{parseInt(civilian.salary).toLocaleString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {civilian.isCriminal ? (
                            <Badge variant="destructive" className="flex items-center w-fit">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Criminal
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center w-fit">
                              <Shield className="h-3 w-3 mr-1" />
                              Clear
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CivilianDatabasePage;
