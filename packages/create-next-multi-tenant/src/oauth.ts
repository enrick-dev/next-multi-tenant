import http from "http";
import crypto from "crypto";
import open from "open";

const DHEME_BASE_URL = process.env.DHEME_BASE_URL || "https://dheme.com";
const DHEME_AUTH_URL = `${DHEME_BASE_URL}/oauth/authorize`;
const DHEME_TOKEN_URL = `${DHEME_BASE_URL}/api/oauth/token`;
const CLI_CLIENT_ID = "create-next-multi-tenant";
const CALLBACK_PORT = 9874;
const TIMEOUT_MS = 5 * 60 * 1000;

export interface OAuthResult {
  apiKey: string;
  accountName: string;
}

export async function startOAuthFlow(): Promise<OAuthResult | null> {
  return new Promise((resolve) => {
    const state = crypto.randomBytes(16).toString("hex");
    let resolved = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
    };

    const server = http.createServer(async (req, res) => {
      if (resolved) return;

      const url = new URL(req.url!, `http://localhost:${CALLBACK_PORT}`);

      if (url.pathname === "/callback") {
        const code = url.searchParams.get("code");
        const returnedState = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        res.setHeader("Access-Control-Allow-Origin", "*");

        if (error) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(getErrorPage(error));
          resolved = true;
          cleanup();
          resolve(null);
          server.close();
          return;
        }

        if (returnedState !== state) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(getErrorPage("Invalid state parameter"));
          resolved = true;
          cleanup();
          resolve(null);
          server.close();
          return;
        }

        if (code) {
          try {
            const result = await exchangeCodeForApiKey(code);

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(getSuccessPage(result.accountName));

            resolved = true;
            cleanup();
            resolve(result);
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Unknown error";
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end(getErrorPage(errorMessage));
            resolved = true;
            cleanup();
            resolve(null);
          }
        } else {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(getErrorPage("No authorization code received"));
          resolved = true;
          cleanup();
          resolve(null);
        }

        server.close();
      }
    });

    server.listen(CALLBACK_PORT, () => {
      const authUrl = new URL(DHEME_AUTH_URL);
      authUrl.searchParams.set("client_id", CLI_CLIENT_ID);
      authUrl.searchParams.set(
        "redirect_uri",
        `http://localhost:${CALLBACK_PORT}/callback`,
      );
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("state", state);
      authUrl.searchParams.set("scope", "api:generate");

      open(authUrl.toString());
    });

    timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        server.close();
        resolve(null);
      }
    }, TIMEOUT_MS);
  });
}

async function exchangeCodeForApiKey(code: string): Promise<OAuthResult> {
  const response = await fetch(DHEME_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: CLI_CLIENT_ID,
      code,
      grant_type: "authorization_code",
      redirect_uri: `http://localhost:${CALLBACK_PORT}/callback`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${text}`);
  }

  const data = (await response.json()) as {
    api_key: string;
    account_name: string;
  };

  if (!data.api_key) {
    throw new Error("Invalid response: missing api_key");
  }

  return {
    apiKey: data.api_key,
    accountName: data.account_name || "User",
  };
}

function getSuccessPage(accountName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Connected to Dheme</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
    }
    h1 { margin: 0 0 16px; font-size: 2rem; }
    p { margin: 0; opacity: 0.9; }
    .account { font-weight: bold; color: #a5f3fc; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Connected to Dheme!</h1>
    <p>Logged in as <span class="account">${accountName}</span></p>
    <p style="margin-top: 16px; opacity: 0.7;">You can close this window and return to the terminal.</p>
  </div>
</body>
</html>
  `.trim();
}

function getErrorPage(error: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Authentication Failed</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
    }
    h1 { margin: 0 0 16px; font-size: 2rem; }
    p { margin: 0; opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Authentication Failed</h1>
    <p>${error}</p>
    <p style="margin-top: 16px; opacity: 0.7;">You can close this window and try again from the terminal.</p>
  </div>
</body>
</html>
  `.trim();
}
