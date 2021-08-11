import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { CONNECTION_SCOPE, SCOPES } from "../../../scopes";

export default handleAuth({
  async login(req, res) {
    return handleLogin(req, res, {
      authorizationParams: {
        // audience: "https://www.googleapis.com", // or AUTH0_AUDIENCE
        // Add the `offline_access` scope to also get a Refresh Token
        access_type: "offline",
        prompt: "consent",
        scope: SCOPES.join(" "),
        connection_scope: CONNECTION_SCOPE.join(" "),
      },
    }).catch((error) => res.status(error.status || 400).end(error.message));
  },
});
