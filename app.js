const authConfig = {
  clientId: "0oafnqigbmVY0HqZj5d7",
  redirectUri: "http://localhost:5500/index.html",
  authorizationUrl: "https://dev-24350261.okta.com/oauth2/default/v1/authorize",
  tokenUrl: "https://dev-24350261.okta.com/oauth2/default/v1/token",
  scope: "openid profile email", // Adjust scope as needed
};

let code = null;

let accessToken = null;

function login() {
  window.localStorage.setItem("loginBy", "web");
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
  console.log("auth URL = " + authorizationUrl);
  // Open the authorization URL in a new window or redirect the current window
  window.location.href = authorizationUrl;
}

function handleCallback() {
  const initiatedBy = window.localStorage.getItem("loginBy");
  const queryParams = new URLSearchParams(window.location.search);
  code = queryParams.get("code");

  const codeVerifierValue = localStorage.getItem("savedCodeVerifierValue");

  if (code && initiatedBy == "web") {
    // Exchange the code for an access token
    // in LP world, you will send the code and codeVerifer value in LP's getAuthenitcationJWT callback
    const tokenUrl =
      `${authConfig.tokenUrl}?client_id=${authConfig.clientId}&redirect_uri=${authConfig.redirectUri}` +
      `&grant_type=authorization_code&code=${code}&code_verifier=${codeVerifierValue}`;

    console.log(tokenUrl);
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
        document.getElementById(
          "dynamicText"
        ).innerHTML = `Token = ${accessToken}`;
        // console.log("save access token to local storage " + accessToken);
        localStorage.setItem("savedToken", accessToken);
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

document.addEventListener("DOMContentLoaded", function () {
  console.log("Hello from LP!");
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

  window.lpLoginUser = function (pkce) {
    window.localStorage.setItem("loginBy", "lp");
    const generatedState = random_string(32);
    //const authURI = authConfig.authorizationUrl;
    var cnf = {
      redirect_uri: authConfig.redirectUri,
      client_id: authConfig.clientId,
      scope: authConfig.scope,
      response_type: "code",
      code_challenge: pkce,
      code_challenge_method: "S256",
      state: generatedState,
    };

    // Convert JSON to URL parameters
    const urlParameters = Object.keys(cnf)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(cnf[key])
      )
      .join("&");

    // Append parameters to a base URL
    const baseUrl = authConfig.authorizationUrl;
    const fullUrl = baseUrl + "?" + urlParameters;

    console.log(fullUrl);
    window.location.href = fullUrl;
    
  };

  // Authentication JSMethod for LiveEngage
  // https://l-p.atlassian.net/wiki/spaces/MAN/pages/178225162/Support+oAuth2.0+code+flow+with+PKCE
  // LP generates the pkce code verifier and keeping it secret
  window.lpGetAuthenticationToken = function (callback, pkce) {
    console.log(
      "inside lpGetAuthenticationToken! LP generated code verifier " + pkce
    );

    // cache pkce value to store code
    window.localStorage.setItem("lppkce", pkce);



    if (typeof code === "undefined" || code === null) {
      console.log("code undefined");
      window.lpLoginUser(pkce);
    } else {
      console.log("code exists " + code);

      var payload = {
        ssoKey: code,
        redirect_uri: document.location.href,
      };
      // console.log('error: ' + error);
      var error;
      if (error !== "undefined") {
        callback(payload, error);
      } else {
        callback(payload);
      }
    }

    // const authCode = localStorage.getItem("savedToken");
    // const authCode2 = "WvMydGyvkUmz6TTTedTvWMG4QNzED5lVnIyrEnHodF";

    // console.log("call back with auth code " + authCode);
    // const REDIRECT_URI = "http://localhost:5500/index.html";
    // callback({ ssoKey: authCode2, redirect_uri: REDIRECT_URI });
    //   callback(authCode)
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
  };
});
