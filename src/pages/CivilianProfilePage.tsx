
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  User, Mail, Phone, Home, Briefcase, 
  Save, Edit, Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { getCivilianById, updateCivilianProfile } from "@/services/dataService";

const CivilianProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // For demo purposes, we're using a hard-coded ID
  const civilianId = "201";
  
  const { data: civilian, isLoading, refetch } = useQuery({
    queryKey: ["civilian", civilianId],
    queryFn: () => getCivilianById(civilianId),
    enabled: !!civilianId
  });
  
  const [formData, setFormData] = useState({
    job: "",
    salary: "",
    houseNo: "",
    locality: "",
    city: "",
    state: "",
    pinCode: ""
  });
  
  // Initialize form data when civilian data is loaded
  useState(() => {
    if (civilian) {
      setFormData({
        job: civilian.job || "",
        salary: civilian.salary || "",
        houseNo: civilian.address.houseNo,
        locality: civilian.address.locality,
        city: civilian.address.city,
        state: civilian.address.state,
        pinCode: civilian.address.pinCode
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateCivilianProfile(civilianId, data),
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      refetch();
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateMutation.mutate({
      job: formData.job,
      salary: formData.salary,
      address: {
        houseNo: formData.houseNo,
        locality: formData.locality,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-police-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!civilian) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">Civilian profile not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 rounded-full bg-police-100 flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-police-600" />
                </div>
                <CardTitle>{civilian.name}</CardTitle>
                <CardDescription>
                  {civilian.isCriminal ? (
                    <span className="text-red-500 flex items-center justify-center mt-2">
                      <Shield className="h-4 w-4 mr-1" />
                      Criminal Record
                    </span>
                  ) : (
                    <span className="text-green-600 flex items-center justify-center mt-2">
                      <Shield className="h-4 w-4 mr-1" />
                      Clean Record
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{civilian.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{civilian.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p>
                        {civilian.address.houseNo}, {civilian.address.locality}, {civilian.address.city},
                        <br />
                        {civilian.address.state} - {civilian.address.pinCode}
                      </p>
                    </div>
                  </div>
                  
                  {civilian.job && (
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Occupation</p>
                        <p>{civilian.job}</p>
                        {civilian.salary && (
                          <p className="text-sm text-gray-500">
                            Annual Salary: ₹{parseInt(civilian.salary).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setIsEditing(!isEditing)} 
                  variant="outline" 
                  className="w-full"
                >
                  {isEditing ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Cancel Editing
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                <TabsTrigger value="complaints">My Complaints</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="job">Occupation</Label>
                            <Input
                              id="job"
                              name="job"
                              value={formData.job}
                              onChange={handleInputChange}
                              placeholder="e.g. Software Engineer"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="salary">Annual Salary</Label>
                            <Input
                              id="salary"
                              name="salary"
                              value={formData.salary}
                              onChange={handleInputChange}
                              placeholder="e.g. 1200000"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Address</Label>
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <Input
                              name="houseNo"
                              value={formData.houseNo}
                              onChange={handleInputChange}
                              placeholder="House/Flat No."
                            />
                            
                            <Input
                              name="locality"
                              value={formData.locality}
                              onChange={handleInputChange}
                              placeholder="Locality"
                            />
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-3">
                            <Input
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="City"
                            />
                            
                            <Input
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="State"
                            />
                            
                            <Input
                              name="pinCode"
                              value={formData.pinCode}
                              onChange={handleInputChange}
                              placeholder="PIN Code"
                            />
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-police-600 hover:bg-police-700"
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </span>
                          )}
                        </Button>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-500 italic">
                          Click "Edit Profile" to update your information.
                        </p>
                        
                        <div className="border-t pt-4">
                          <h3 className="font-medium mb-2">Important Notes</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            <li>Keeping your address updated helps police respond efficiently to emergencies.</li>
                            <li>Your information is protected and only accessible to authorized personnel.</li>
                            <li>Report any suspicious activities at your nearest police station.</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="complaints" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Complaints Filed</CardTitle>
                    <CardDescription>
                      Track the status of complaints you have filed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-500">You haven't filed any complaints yet.</p>
                      <Button className="mt-4" variant="outline">
                        File a New Complaint
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivilianProfilePage;
