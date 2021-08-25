import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    return handleLogin(req, res, {
      authorizationParams: {
        // access_type: "offline",
        // prompt: "consent",
      },
    }).catch((error) => res.status(error.status || 400).end(error.message));
  },
});
