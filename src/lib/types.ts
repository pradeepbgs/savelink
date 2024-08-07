// types.ts or store.ts
export interface AuthState {
    isLoggedIn: boolean;
    // other auth-related state
  }
  
  export interface RootState {
    auth: AuthState;
    // Assuming LinkState is defined elsewhere
    // other slices of state
}


