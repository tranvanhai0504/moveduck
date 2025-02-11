import { type AuthTokenClaims, PrivyClient } from "@privy-io/server-auth";

export type AuthenticateSuccessResponse = {
    claims: AuthTokenClaims;
  };
  
  export type AuthenticationErrorResponse = {
    error: string;
  };

const PRIVY_API_KEY = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET ?? "";

// Initialize Privy client with your app's credentials
const privy = new PrivyClient(PRIVY_API_KEY, PRIVY_APP_SECRET);

// Export the client for use in other files
export default privy;
