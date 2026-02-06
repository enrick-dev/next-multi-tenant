import { NextRequest, NextResponse } from "next/server";

const DHEME_BASE_URL = process.env.DHEME_BASE_URL || "https://dheme.com";
const DHEME_TOKEN_URL = `${DHEME_BASE_URL}/api/oauth/token`;
const DHEME_CLIENT_ID = "create-next-multi-tenant";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return new NextResponse(getErrorPage(error), {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!code) {
    return new NextResponse(getErrorPage("No authorization code received"), {
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const tokenResponse = await fetch(DHEME_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: DHEME_CLIENT_ID,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${request.nextUrl.origin}/api/dheme/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Token exchange failed");
    }

    const data = await tokenResponse.json();
    const apiKey = data.api_key;
    const accountName = data.account_name || "User";

    return new NextResponse(getSuccessPage(apiKey, accountName, state), {
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return new NextResponse(getErrorPage("Failed to complete authentication"), {
      headers: { "Content-Type": "text/html" },
    });
  }
}

function getSuccessPage(
  apiKey: string,
  accountName: string,
  state: string | null,
): string {
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
    h1 { margin: 0 0 16px; font-size: 1.5rem; }
    p { margin: 0; opacity: 0.9; font-size: 14px; }
    .account { font-weight: bold; color: #a5f3fc; }
    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 16px auto 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <h1>Connected to Dheme!</h1>
    <p>Welcome, <span class="account">${accountName}</span></p>
    <p style="margin-top: 8px; opacity: 0.7;">Closing this window...</p>
    <div class="spinner"></div>
  </div>
  <script>
    (function() {
      const state = ${JSON.stringify(state)};
      const apiKey = ${JSON.stringify(apiKey)};
      const storedState = window.opener?.sessionStorage?.getItem('dheme_oauth_state');

      if (storedState && storedState === state) {
        window.opener.postMessage({
          type: 'dheme_oauth_success',
          apiKey: apiKey
        }, window.location.origin);
      } else {
        window.opener?.postMessage({
          type: 'dheme_oauth_error',
          error: 'State verification failed'
        }, window.location.origin);
      }

      setTimeout(() => window.close(), 1500);
    })();
  </script>
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
    h1 { margin: 0 0 16px; font-size: 1.5rem; }
    p { margin: 0; opacity: 0.9; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Authentication Failed</h1>
    <p>${error}</p>
    <p style="margin-top: 16px; opacity: 0.7;">You can close this window and try again.</p>
  </div>
  <script>
    window.opener?.postMessage({
      type: 'dheme_oauth_error',
      error: ${JSON.stringify(error)}
    }, window.location.origin);
  </script>
</body>
</html>
  `.trim();
}
