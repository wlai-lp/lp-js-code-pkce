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
        document.getElementById('dynamicText').innerHTML = `Token = ${accessToken}`;
        console.log("save access token to local storage " + accessToken);
        localStorage.setItem('savedToken', accessToken);
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('Hello from LP!');
    var lpTag = window.lpTag || {};
    lpTag.identities = [];
    // Your additional JavaScript logic goes here
    function identityFn(callback) {
      console.log("identity function");
      callback({
        // all three are required
        iss: "https://dev-24350261.okta.com",
        acr: "loa1",
        sub: "920001",
      });
    }

    lpTag.identities.push(identityFn);

    // Authentication JSMethod for LiveEngage
    window.lpGetAuthenticationToken = function (callback) {
      console.log("inside lpGetAuthenticationToken!");  
      const authCode = localStorage.getItem('savedToken');
      console.log("call back with auth code " + authCode)
      callback(authCode)
      // const URL_PARAMS = new URLSearchParams(window.location.search);
      // const code = URL_PARAMS.get('code');

    //   // NOTE: this is the location of the code, if oauth ever decide to change it then it will break
    //   let code = "garbage";
    //   if(window.location.search.indexOf("code") > 0){
    //     code = window.location.search.split("&")[0].split("=")[1];
    //   } 
    //   //- let uri = "http://localhost:3000";
    //   let uri = "http://localhost:3000/authorization-code/callback";

    //   // you have to return something, even empty code, else the chatbox will keep waiting for code
    //   console.log("got code " + code);
    //   console.log("calling callback with code...");
    //   callback({
    //     ssoKey: code,
    //     redirect_uri: uri
    //   });
      //- callback(code);
    }


});

