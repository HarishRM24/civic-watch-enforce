
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ChevronLeft, User, FileText, Send,
  AlertCircle, Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { getPoliceStations, submitComplaint } from "@/services/dataService";

const ComplaintPage = () => {
  const { officerId = "new" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaintText, setComplaintText] = useState("");
  
  const { data: stations } = useQuery({
    queryKey: ["policeStations"],
    queryFn: getPoliceStations
  });
  
  // Find the target officer
  const allOfficers = stations?.flatMap(station => station.officers) || [];
  const targetOfficer = officerId !== "new" 
    ? allOfficers.find(officer => officer.id === officerId)
    : null;
  
  const submitMutation = useMutation({
    mutationFn: (data: any) => submitComplaint(data),
    onSuccess: () => {
      toast({
        title: "Complaint submitted",
        description: "Your complaint has been recorded successfully",
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit complaint",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complaintText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your complaint",
        variant: "destructive",
      });
      return;
    }
    
    submitMutation.mutate({
      officerId: targetOfficer?.id || "unknown",
      complainantId: user?.id || "unknown",
      text: complaintText
    });
  };

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
              {targetOfficer ? `File Complaint Against ${targetOfficer.name}` : "File New Complaint"}
            </h1>
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
        <div className="max-w-3xl mx-auto">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              Filing a false complaint is a punishable offense. Please ensure all information provided is accurate and truthful.
            </AlertDescription>
          </Alert>
          
          {targetOfficer ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Officer Information</CardTitle>
                <CardDescription>
                  You are filing a complaint against the following officer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-police-100 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-police-600" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">{targetOfficer.name}</h3>
                    <p className="text-sm text-police-600">{targetOfficer.rank}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{targetOfficer.email}</p>
                      <p>{targetOfficer.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select an Officer</CardTitle>
                <CardDescription>
                  Please select the officer you wish to file a complaint against
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stations?.map((station) => (
                    <div key={station.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-medium">{station.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{station.area}, {station.city}</p>
                      
                      <div className="space-y-2 mt-3">
                        {station.officers.map((officer) => (
                          <Link to={`/complaint/${officer.id}`} key={officer.id}>
                            <div className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                              <User className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="font-medium">{officer.name}</p>
                                <p className="text-xs text-gray-500">{officer.rank}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {targetOfficer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Complaint Details
                </CardTitle>
                <CardDescription>
                  Provide specific details about your complaint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-1">
                        Complaint Description
                      </label>
                      <Textarea
                        id="complaint"
                        placeholder="Describe your complaint in detail..."
                        rows={6}
                        value={complaintText}
                        onChange={(e) => setComplaintText(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                      <h4 className="text-amber-800 font-medium mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Declaration
                      </h4>
                      <p className="text-sm text-amber-700">
                        By submitting this complaint, I hereby declare that all information provided is true and accurate to the best of my knowledge.
                        I understand that filing a false complaint may result in legal action against me.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      type="submit" 
                      className="bg-police-600 hover:bg-police-700 w-full"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send className="h-4 w-4 mr-2" />
                          Submit Complaint
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <div className="w-full text-center text-sm text-gray-500">
                  Your complaint will be reviewed by senior officials within 48 hours.
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;
