
// This file contains mock data services that would typically connect to a backend API

export interface PoliceStation {
  id: string;
  name: string;
  area: string;
  city: string;
  state: string;
  phoneNumber: string;
  officers: PoliceOfficer[];
}

export interface PoliceOfficer {
  id: string;
  name: string;
  rank: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: string;
  description?: string;
}

export interface Civilian {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    houseNo: string;
    locality: string;
    city: string;
    state: string;
    pinCode: string;
  };
  job?: string;
  salary?: string;
  isCriminal: boolean;
}

export interface Criminal extends Civilian {
  crimes: {
    id: string;
    description: string;
    date: string;
  }[];
}

export interface Complaint {
  id: string;
  officerId: string;
  complainantId: string;
  text: string;
  timestamp: string;
}

// Mock data
const policeStations: PoliceStation[] = [
  {
    id: "1",
    name: "Amritapuri Police Station",
    area: "Amritapuri",
    city: "Kerala",
    state: "Kerala",
    phoneNumber: "0476-123456",
    officers: [
      {
        id: "101",
        name: "Sarfaraz Khan",
        rank: "Assistant Superintendent",
        email: "sarfarazkhan@example.com",
        phoneNumber: "7788665544",
        age: 26,
        gender: "Male",
        description: "I hate crime"
      }
    ]
  },
  {
    id: "2",
    name: "Amritsar Central Police Station",
    area: "Preet Nagar",
    city: "Amritsar",
    state: "Punjab",
    phoneNumber: "0183-987654",
    officers: [
      {
        id: "102",
        name: "Rajinder Singh",
        rank: "Inspector",
        email: "rsingh@example.com",
        phoneNumber: "9988776655",
        age: 32,
        gender: "Male"
      }
    ]
  },
  {
    id: "3",
    name: "Bandra Local Police Station",
    area: "Bandra",
    city: "Mumbai",
    state: "Maharashtra",
    phoneNumber: "022-8765432",
    officers: [
      {
        id: "103",
        name: "Priya Sharma",
        rank: "Sub-Inspector",
        email: "psharma@example.com",
        phoneNumber: "7654321098",
        age: 29,
        gender: "Female"
      }
    ]
  },
  {
    id: "4",
    name: "Dwarka Mor Police Station",
    area: "Dwarka Mor",
    city: "New Delhi",
    state: "Delhi",
    phoneNumber: "011-23456789",
    officers: [
      {
        id: "104",
        name: "Vikram Khanna",
        rank: "Station House Officer",
        email: "vkhanna@example.com",
        phoneNumber: "9876543210",
        age: 35,
        gender: "Male"
      }
    ]
  }
];

const civilians: Civilian[] = [
  {
    id: "201",
    name: "Manan Vohra",
    email: "mananvohra@example.com",
    phoneNumber: "9911223344",
    address: {
      houseNo: "12",
      locality: "Domlur",
      city: "Bangalore",
      state: "Karnataka",
      pinCode: "560071"
    },
    job: "Software Engineer",
    salary: "1200000",
    isCriminal: false
  },
  {
    id: "202",
    name: "Ananya Patel",
    email: "ananya@example.com",
    phoneNumber: "8877665544",
    address: {
      houseNo: "45",
      locality: "Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      pinCode: "560038"
    },
    job: "Doctor",
    salary: "1800000",
    isCriminal: false
  }
];

const criminals: Criminal[] = [
  {
    id: "301",
    name: "Rakesh Kumar",
    email: "rakesh@example.com",
    phoneNumber: "7766554433",
    address: {
      houseNo: "7",
      locality: "Malviya Nagar",
      city: "Delhi",
      state: "Delhi",
      pinCode: "110017"
    },
    isCriminal: true,
    crimes: [
      {
        id: "1001",
        description: "Theft",
        date: "2023-05-15"
      },
      {
        id: "1002",
        description: "Assault",
        date: "2023-08-22"
      }
    ]
  }
];

const complaints: Complaint[] = [
  {
    id: "401",
    officerId: "101",
    complainantId: "201",
    text: "Does not arrive on time in police station",
    timestamp: "2023-09-10T10:30:00"
  },
  {
    id: "402",
    officerId: "101",
    complainantId: "202",
    text: "Did not handle my FIR properly!",
    timestamp: "2023-09-12T14:45:00"
  },
  {
    id: "403",
    officerId: "102",
    complainantId: "201",
    text: "Comes late for duty",
    timestamp: "2023-09-15T09:15:00"
  }
];

// Service functions
export const getPoliceStations = async (): Promise<PoliceStation[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return policeStations;
};

export const getPoliceStationById = async (id: string): Promise<PoliceStation | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return policeStations.find(station => station.id === id);
};

export const getCivilians = async (): Promise<Civilian[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return civilians;
};

export const getCivilianById = async (id: string): Promise<Civilian | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return civilians.find(civilian => civilian.id === id);
};

export const getCriminals = async (): Promise<Criminal[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return criminals;
};

export const getComplaints = async (officerId?: string): Promise<Complaint[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return officerId 
    ? complaints.filter(complaint => complaint.officerId === officerId)
    : complaints;
};

export const submitComplaint = async (complaint: Omit<Complaint, 'id' | 'timestamp'>): Promise<Complaint> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newComplaint: Complaint = {
    ...complaint,
    id: `${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  
  // In a real app, this would be sent to a backend
  console.log('Submitted complaint:', newComplaint);
  
  return newComplaint;
};

export const updateCivilianProfile = async (id: string, data: Partial<Civilian>): Promise<Civilian> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would update the backend
  console.log('Updated civilian profile:', { id, data });
  
  // Return mocked updated data
  const civilian = civilians.find(c => c.id === id);
  if (!civilian) throw new Error('Civilian not found');
  
  return { ...civilian, ...data };
};

export const assignCriminalStatus = async (civilianId: string, isCriminal: boolean): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, this would update the backend
  console.log('Updated criminal status:', { civilianId, isCriminal });
};
