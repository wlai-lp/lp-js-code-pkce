const authConfig = {
  clientId: "0oafnqigbmVY0HqZj5d7",
  redirectUri: "http://localhost:5500/index.html",
  authorizationUrl: "https://dev-24350261.okta.com/oauth2/default/v1/authorize",
  tokenUrl: "https://dev-24350261.okta.com/oauth2/default/v1/token",
  scope: "openid profile email", // Adjust scope as needed
};

let accessToken = null;

function login() {
  const codeVerifier = generate_code_verifier();
  const codeChallenge = generate_code_challenge(codeVerifier);

  console.log("Code Verifier:", codeVerifier);
  console.log("Code Challenge:", codeChallenge);

  const generatedState = random_string(32);
  localStorage.setItem("savedCodeVerifierValue", codeVerifier);

  const authorizationUrl =
    `${authConfig.authorizationUrl}?client_id=${
      authConfig.clientId
    }&redirect_uri=${encodeURIComponent(authConfig.redirectUri)}` +
    `&response_type=code&scope=${encodeURIComponent(
      authConfig.scope
    )}&code_challenge=${codeChallenge}&state=${generatedState}` +
    "&code_challenge_method=S256";

  // Open the authorization URL in a new window or redirect the current window
  window.location.href = authorizationUrl;
}

function handleCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get("code");

  const codeVerifierValue = localStorage.getItem("savedCodeVerifierValue");

  if (code) {
    // Exchange the code for an access token
    // in LP world, you will send the code and codeVerifer value in LP's getAuthenitcationJWT callback
    const tokenUrl =
      `${authConfig.tokenUrl}?client_id=${authConfig.clientId}&redirect_uri=${authConfig.redirectUri}` +
      `&grant_type=authorization_code&code=${code}&code_verifier=${codeVerifierValue}`;

    fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        accessToken = data.access_token;
        console.log("Access Token:", accessToken);
      })
      .catch((error) =>
        console.error("Error exchanging code for token:", error)
      )
      .finally(() => {
        // Clear the query parameters from the URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      });
  }
}

function logout() {
  accessToken = null;
  console.log("User logged out");
}

// Check for the authorization code in the URL when the page loads
handleCallback();
