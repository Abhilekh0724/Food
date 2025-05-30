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

const initialState: AuthState = {
  loading: true,
  isAuthenticated: false,
  user: null,
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
      const payload = action.payload as {
        isAuthenticated?: boolean;
        user?: User;
      };
      return {
        loading: false,
        isAuthenticated: payload?.isAuthenticated || false,
        user: payload?.user || null,
      };
    case "LOGIN":
      const loginPayload = action.payload as { user?: User };
      return {
        ...state,
        isAuthenticated: true,
        user: loginPayload?.user || null,
      };

    case "LOGOUT":
      localStorage.removeItem("accessToken");
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

  const initialize = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (token) {
        const user = await fetchUser();
        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: false,
            user: undefined,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: "INITIAL",
        payload: {
          isAuthenticated: false,
          user: undefined,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        const { jwt, data } = await apiLogin(email, password);

        localStorage.setItem("accessToken", jwt);
        initialize();
        dispatch({
          type: "LOGIN",
          payload: {
            user: data,
          },
        });
      } catch (error) {
        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: false,
            user: undefined,
          },
        });
        throw error;
      }
    },
    []
  );

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
      dispatch({
        type: "INITIAL",
        payload: {
          isAuthenticated: false,
          user: undefined,
        },
      });
      throw error;
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      loading: state.loading,
      isAuthenticated: state.isAuthenticated,
      user: state.user || null,
      login,
      logout,
      updateUser,
    }),
    [
      state.isAuthenticated,
      state.loading,
      updateUser,
      state.user,
      login,
      logout,
    ]
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
