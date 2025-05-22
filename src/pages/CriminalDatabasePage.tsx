
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, Calendar, AlertTriangle, FileText, 
  User, Filter, Download, Shield 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCriminals } from "@/services/dataService";

const CriminalDatabasePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: criminals, isLoading } = useQuery({
    queryKey: ["criminals"],
    queryFn: getCriminals
  });

  const filteredCriminals = criminals?.filter((criminal) => {
    const query = searchQuery.toLowerCase();
    
    return (
      criminal.name.toLowerCase().includes(query) ||
      criminal.email.toLowerCase().includes(query) ||
      criminal.address.city.toLowerCase().includes(query) ||
      criminal.address.state.toLowerCase().includes(query) ||
      criminal.crimes.some(crime => crime.description.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Criminal Database</h1>
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
                  placeholder="Search by name, crime, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
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
                  <User className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Criminals</p>
                    <p className="text-xl font-semibold">{criminals?.length || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-amber-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Crimes</p>
                    <p className="text-xl font-semibold">
                      {criminals?.reduce((total, criminal) => total + criminal.crimes.length, 0) || 0}
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
            <p>Loading criminal database...</p>
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
                    <TableHead>Crimes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCriminals?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No criminals found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCriminals?.map((criminal) => (
                      <TableRow key={criminal.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 text-red-500 mr-2" />
                            {criminal.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{criminal.email}</div>
                            <div className="text-gray-500">{criminal.phoneNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{criminal.address.city}</div>
                            <div className="text-gray-500">{criminal.address.state}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1.5">
                            {criminal.crimes.map((crime) => (
                              <Badge key={crime.id} variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center w-fit mr-2">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {crime.description}
                                <span className="ml-1 text-xs text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(crime.date).toLocaleDateString()}
                                </span>
                              </Badge>
                            ))}
                          </div>
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

export default CriminalDatabasePage;
