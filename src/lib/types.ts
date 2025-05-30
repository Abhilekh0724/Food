import { ApiResponseI, metaI } from "@/store/interface";
import { PaginationState } from "@tanstack/react-table";

export type Theme = "light" | "dark" | "system";

export interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
}

export interface User {
  id: string | undefined;
  email: string;
  phone: string;
  fullName: string;
  verified: boolean;
  email_verified: boolean;
  username: string;
  firstName: string | null;
  lastName: string | null;
  role: {
    id: string | undefined;
    name: string;
    type: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  confirmed: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Optionally include nested profile if used
  organizerProfile: {
    id: string | undefined;
    name: string;
    description: string;
    phoneNumber: string | null;
    contactEmail: string | null;
    isVerified: boolean;
    status: string;
    type: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    organizationId: string;
    mapLocation: string | null;
    workingDistricts: string | null;
    website: string | null;
    verificationNotes: string | null;
  };

  avatar: {
    url: string;
  };
  bloodType: string;
  avatarUrl: string;
}

export interface BloodGroup {
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  attributes: {
    id: string;
    caseDescription: string;
    noOfUnits: number;
    isForSelf: boolean;
    patientName: string;
    patientAge: number;
    patientPhone: string;
    patientGender: string;
    needBefore: string; // ISO date string
    isFulFilled: boolean;
    bloodType: string;
    urgency: string;
    hospital: string;
    relationToPatient: string;
    location: string | null;
    metaData: any;
    verified: boolean;
    district: string;
    streetAddress: string;
    municipality: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    bloodRequestId: string;
    requestedBy: {
      data: {
        id: string;
        attributes: User;
      };
    };
    requestedBloodGroup: {
      data: {
        id: string;
        attributes: BloodGroup;
      };
    };

    attachments: {
      data: {
        id: string;
        attributes: {
          name: string;
          url: string;
        };
      }[];
    };

    acceptors: {
      data: {
        id: string;
        attributes: {
          acceptor: {
            data: {
              id: string;
              attributes: User;
            };
          };
          donatedUnits: number;
          acceptedAt: string;
          status: string;
        };
      }[];
    };
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (data: any) => void;
}

export interface ApiResponse {
  accessToken: string;
  user: User;
}

export interface PaginationI {
  pagination: {
    pageSize: number;
    pageIndex: number;
  };
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  data: ApiResponseI;
}

export interface BloodGroup {
  id: number;
  attributes: {
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface BloodGroupI {
  data: BloodGroup[];
  meta: metaI;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  type: "authenticated" | "public" | string;
  createdAt: string;
  updatedAt: string;
  nb_users: number;
}

export interface OrganizerI {
  id: number;
  name: string;
  description: string;
  type: "authenticated" | "public" | string;
  createdAt: string;
  updatedAt: string;
  nb_users: number;
}


export interface RolesI {
  roles: Role[];
}

/**
 * Interface representing a blood unit in the blood bank system
 */
export interface BloodUnit {
  /**
   * Unique identifier for the blood pouch
   * @example "BP-12345"
   */
  id: string;

  /**
   * Unique identifier for the pouchID
   * @example "PI-12345"
   */
  pouchId: string;

  isUsed: boolean;
  isWasted: boolean;
  isTransferred: boolean;
  isApproved: boolean;

  /**
   * Unique identifier for the donor
   * @example "43"
   */
  donor: string;

  /**
   * Blood type of the unit
   * @example "Plasma"
   */
  bloodType: string;

  /**
   * Blood type of the unit
   * @example "A+", "O-", "AB+"
   */
  bloodGroup: string;

  /**
   * Date when the blood was donated
   * @example "2025-05-01"
   */
  donationDate: string;

  /**
   * Date when the blood unit will expire
   * @example "2025-06-01"
   */
  expiryDate: string;



  /**
   * Current status of the blood unit
   * @example "Available", "Reserved", "Expiring Soon", "Used", "Wasted"
   */
  status: "Available" | "Reserved" | "Expiring Soon" | "Used" | "Wasted";

  /**
   * Physical location where the blood unit is stored
   * @example "Main Storage", "Cold Storage"
   */
  location?: string;

  /**
   * Optional recipient information if the blood has been assigned
   * @example "Memorial Hospital"
   */
  recipient?: string;

  /**
   * Optional purpose for which the blood unit is being used
   * @example "Surgery", "Emergency", "Transfusion"
   */
  purpose?: string;

  /**
   * Optional date when the blood was used or wasted
   * @example "2025-05-15"
   */
  usageDate?: string;

  /**
   * Optional reference to the donor's ID
   * @example "D-1001"
   */
  donorId?: string;

  /**
   * Optional quantity of blood in milliliters
   * @example 450
   */
  quantity?: number;

  /**
   * Optional notes or additional information about the blood unit
   */
  notes?: string;

  /**
   * Optional array of test results for this blood unit
   */
  tests?: Array<{
    name: string;
    result: string;
    date: string;
  }>;

  /**
   * Optional history of actions performed on this blood unit
   */
  history?: Array<{
    date: string;
    action: string;
    details: string;
  }>;
}

export interface BloodTransferI {
  /**
   * Unique identifier for the blood pouch
   * @example "BP-12345"
   */
  id: string;



  /**
   * Unique identifier for the pouchID
   * @example "PI-12345"
   */
  requester: { attributes: OrganizerI };

  bloodType: string
  noOfUnits: string

  /**
   * Unique identifier for the donor
   * @example "43"
   */
  donor: string;



  /**
   * Blood type of the unit
   * @example "A+", "O-", "AB+"
   */
  bloodGroup: string;

  /**
   * Date when the blood was donated
   * @example "2025-05-01"
   */
  donationDate: string;

  /**
   * Date when the blood unit will expire
   * @example "2025-06-01"
   */
  requestedDate: string;



  /**
   * Current status of the blood unit
   * @example "Pending", "Approve", "Reject"
   */
  status: "Pending" | "Approve" | "Reject" | 'Transfer' | "Cancel" | 'Used'

  tab: "incoming" | "outgoing";

  /**
   * Physical location where the blood unit is stored
   * @example "Main Storage", "Cold Storage"
   */
  location?: string;


  message?: string;

  /**
   * Optional recipient information if the blood has been assigned
   * @example "Memorial Hospital"
   */
  recipient?: string;

  /**
   * Optional purpose for which the blood unit is being used
   * @example "Surgery", "Emergency", "Transfusion"
   */
  purpose?: string;

  /**
   * Optional date when the blood was used or wasted
   * @example "2025-05-15"
   */
  usageDate?: string;



  /**
   * Optional quantity of blood in milliliters
   * @example 450
   */
  quantity?: number;

  /**
   * Optional notes or additional information about the blood unit
   */
  notes?: string;

  /**
   * Optional array of test results for this blood unit
   */
  tests?: Array<{
    name: string;
    result: string;
    date: string;
  }>;

  /**
   * Optional history of actions performed on this blood unit
   */
  history?: Array<{
    date: string;
    action: string;
    details: string;
  }>;
}

/**
 * Interface for blood stock statistics
 */
export interface BloodStockStats {
  /**
   * Total number of available units
   */
  totalAvailable: number;

  /**
   * Number of units expiring soon
   */
  expiringSoon: number;

  /**
   * Units by blood type
   */
  byBloodType: Record<string, number>;
}

/**
 * Interface representing blood usage and wastage data in the blood bank system
 */
export interface BloodUsage {
  /**
   * Unique identifier for the blood pouch
   * @example "BP-12345"
   */
  id: string;

  /**
   * Unique identifier for the pouchID
   * @example "PI-12345"
   */
  pouchId: string;

  isUsed: boolean;

  /**
   * Unique identifier for the donor
   * @example "43"
   */
  donor: string;

  /**
   * Blood type of the unit
   * @example "Plasma"
   */
  bloodType: string;

  /**
   * Blood type of the unit
   * @example "A+", "O-", "AB+"
   */
  bloodGroup: string;

  /**
   * Date when the blood was donated
   * @example "2025-05-01"
   */
  donationDate: string;


  usedAt: string;

  /**
   * Date when the blood unit will expire
   * @example "2025-06-01"
   */
  expiryDate: string;



  /**
   * Current status of the blood unit
   * @example "Available", "Reserved", "Expiring Soon", "Used", "Wasted"
   */
  status: "Available" | "Reserved" | "Expiring Soon" | "Used" | "Wasted";

  /**
   * Physical location where the blood unit is stored
   * @example "Main Storage", "Cold Storage"
   */
  location?: string;

  /**
   * Optional recipient information if the blood has been assigned
   * @example "Memorial Hospital"
   */
  recipient?: string;

  /**
   * Optional purpose for which the blood unit is being used
   * @example "Surgery", "Emergency", "Transfusion"
   */
  purpose?: string;

  /**
   * Optional date when the blood was used or wasted
   * @example "2025-05-15"
   */
  usageDate?: string;

  /**
   * Optional reference to the donor's ID
   * @example "D-1001"
   */
  donorId?: string;

  /**
   * Optional quantity of blood in milliliters
   * @example 450
   */
  quantity?: number;

  /**
   * Optional notes or additional information about the blood unit
   */
  notes?: string;

  /**
   * Optional array of test results for this blood unit
   */
  tests?: Array<{
    name: string;
    result: string;
    date: string;
  }>;

  /**
   * Optional history of actions performed on this blood unit
   */
  history?: Array<{
    date: string;
    action: string;
    details: string;
  }>;
}

/**
 * Interface for usage and wastage statistics
 */
export interface UsageWastageStats {
  /**
   * Total number of units used
   */
  totalUsed: number;

  /**
   * Total number of units wasted
   */
  totalWasted: number;

  /**
   * Wastage rate as a percentage
   */
  wastageRate: number;

  /**
   * Number of units expiring in the next 7 days
   */
  expiringSoon: number;

  /**
   * Usage by purpose
   */
  usageByPurpose: Record<string, number>;

  /**
   * Wastage by reason
   */
  wastageByReason: Record<string, number>;

  /**
   * Usage by blood type
   */
  usageByBloodType: Record<string, number>;

  /**
   * Time period for the statistics
   */
  period: "7days" | "30days" | "90days" | "year";
}

/**
 * Interface for usage trend data
 */
export interface UsageTrend {
  /**
   * Date of the data point
   */
  date: string;

  /**
   * Number of units used on this date
   */
  used: number;

  /**
   * Number of units wasted on this date
   */
  wasted: number;
}
