// AuthContext.tsx
import { AuthContextType, User } from "@/lib/types";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { login as apiLogin, fetchUser } from "../api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin user for development
const mockAdminUser: User = {
  id: "admin123",
  email: "admin@example.com",
  phone: "+1234567890",
  fullName: "Admin User",
  verified: true,
  email_verified: true,
  username: "admin",
  firstName: "Admin",
  lastName: "User",
  role: {
    id: "1",
    name: "Admin",
    type: "authenticated",
    description: "Administrator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  confirmed: true,
  phoneVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  organizerProfile: {
    id: "org123",
    name: "Admin Organization",
    description: "Main organization",
    phoneNumber: "+1234567890",
    contactEmail: "admin@example.com",
    isVerified: true,
    status: "active",
    type: "Blood Bank",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    organizationId: "org123",
    mapLocation: null,
    workingDistricts: null,
    website: null,
    verificationNotes: null,
    address: {
      country: "Nepal",
      district: "Kathmandu",
      municipality: "Kathmandu",
      zipCode: "44600",
      streetAddress: "Main Street",
      city: "Kathmandu",
      wardNo: "1",
    },
    avatar: {
      url: "",
    },
  },
  avatar: {
    url: "",
  },
  bloodType: "A+",
  avatarUrl: "",
};

const initialState: AuthState = {
  loading: false,
  isAuthenticated: true, // Start as authenticated
  user: mockAdminUser, // Start with mock user
};

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthAction {
  type: "INITIAL" | "LOGIN" | "LOGOUT" | "UPDATE_USER" | "SET_GAME_TYPE";
  payload?:
    | {
        isAuthenticated?: boolean;
        user?: User;
      }
    | string;
}

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INITIAL":
      return state; // Keep the initial state
    case "LOGIN":
      return state; // Keep the initial state
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "UPDATE_USER":
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, ...(action.payload as Partial<User>) } as User,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    // No-op since we're always authenticated
    return Promise.resolve();
  }, []);

  const logout = useCallback(() => {
    dispatch({
      type: "LOGOUT",
    });
  }, []);

  const updateUser = useCallback(async (data: any): Promise<void> => {
    try {
      dispatch({
        type: "UPDATE_USER",
        payload: data,
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      loading: state.loading,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      login,
      logout,
      updateUser,
    }),
    [state.isAuthenticated, state.loading, state.user, login, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
