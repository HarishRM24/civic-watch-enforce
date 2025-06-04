
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getCivilianByUserId, updateCivilianByUserId } from "@/services/civilianService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Phone, MapPin, Briefcase, DollarSign, Edit, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CivilianProfilePage = () => {
  const { user, userProfile } = useAuth();
  const [civilianData, setCivilianData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    job: "",
    salary: ""
  });

  useEffect(() => {
    const fetchCivilianData = async () => {
      if (user?.id) {
        try {
          const data = await getCivilianByUserId(user.id);
          if (data) {
            setCivilianData(data);
            setFormData({
              name: data.name || "",
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
              state: data.state || "",
              pincode: data.pincode || "",
              job: data.job || "",
              salary: data.salary || ""
            });
          }
        } catch (error) {
          console.error("Error fetching civilian data:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCivilianData();
  }, [user?.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const updatedData = await updateCivilianByUserId(user.id, formData);
      
      if (updatedData) {
        setCivilianData(updatedData);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (civilianData) {
      setFormData({
        name: civilianData.name || "",
        phone: civilianData.phone || "",
        address: civilianData.address || "",
        city: civilianData.city || "",
        state: civilianData.state || "",
        pincode: civilianData.pincode || "",
        job: civilianData.job || "",
        salary: civilianData.salary || ""
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-police-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-police-600 hover:bg-police-700">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 bg-police-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-police-600" />
              </div>
              <h3 className="text-xl font-semibold">{formData.name || "User"}</h3>
              <p className="text-gray-600">{userProfile?.email || user?.email}</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">Civilian</Badge>
              {civilianData?.is_criminal && (
                <Badge className="mt-1 bg-red-100 text-red-800">Criminal Record</Badge>
              )}
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                {isEditing ? "Edit your personal details" : "View your personal details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{formData.name || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{formData.phone || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your address"
                      rows={2}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData.address || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Enter your city"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData.city || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  {isEditing ? (
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="Enter your state"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData.state || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="pincode">PIN Code</Label>
                  {isEditing ? (
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      placeholder="Enter your PIN code"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData.pincode || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="job">Occupation</Label>
                  {isEditing ? (
                    <Input
                      id="job"
                      value={formData.job}
                      onChange={(e) => handleInputChange("job", e.target.value)}
                      placeholder="Enter your occupation"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>{formData.job || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="salary">Salary</Label>
                  {isEditing ? (
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                      placeholder="Enter your salary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>{formData.salary || "Not provided"}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CivilianProfilePage;
