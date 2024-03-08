const authConfig = {
    clientId: '0oafnqigbmVY0HqZj5d7',
    redirectUri: 'http://localhost:5500/index.html',
    authorizationUrl: 'https://dev-24350261.okta.com/oauth2/default/v1/authorize',
    tokenUrl: 'https://dev-24350261.okta.com/oauth2/default/v1/token',
    scope: 'openid profile email', // Adjust scope as needed
  };
  
  let accessToken = null;
  
  function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }
  
  function createCodeVerifier() {
    return generateRandomString(43);
  }
  
  function createCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    return crypto.subtle.digest('SHA-256', data).then(buffer => {
        console.log('hi ' + buffer);
        const textDecoder = new TextDecoder('utf-8');
        const resultString = textDecoder.decode(buffer);
        console.log(resultString);
        debugger;
      return Array.from(new Uint8Array(buffer))
        .map(b => String.fromCharCode(b))
        .join('')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    });
  }

  function generateRandomState() {
    const stateLength = 32; // Adjust the length as needed
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let state = '';
  
    for (let i = 0; i < stateLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      state += charset.charAt(randomIndex);
    }
  
    return state;
  }

  
function base64UrlEncode(str) {
    const base64 = btoa(str);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  
  function generateCodeVerifier() {
    return generateRandomString(128);
  }
  
  async function sha256(inputString) {
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);
  
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
    return hashHex;
  }
  

  function generateCodeChallenge(codeVerifier) {

    const codeChallenge = base64UrlEncode(sha256(codeVerifier));
    return codeChallenge;
  }

  function sha256bin(ascii) {
    return hex2bin(sha256(ascii));
  }
  
  function base64_urlencode(str) {
    return btoa(str)
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=/g, '');
  }

  // Array of integers to binary data
 function dec2bin(arr) {
    return hex2bin(Array.from(arr, dec2hex).join(''));
  }

  function hex2bin(s) {
    //  discuss at: http://locutus.io/php/hex2bin/
    // original by: Dumitru Uzun (http://duzun.me)
    //   example 1: hex2bin('44696d61')
    //   returns 1: 'Dima'
    //   example 2: hex2bin('00')
    //   returns 2: '\x00'
    //   example 3: hex2bin('2f1q')
    //   returns 3: false
  
    var ret = []
    var i = 0
    var l
  
    s += ''
  
    for (l = s.length; i < l; i += 2) {
      var c = parseInt(s.substr(i, 1), 16)
      var k = parseInt(s.substr(i + 1, 1), 16)
      if (isNaN(c) || isNaN(k)) return false
      ret.push((c << 4) | k)
    }
  
    return String.fromCharCode.apply(String, ret)
  }

  function random_string(len) {
    var arr = new Uint8Array(len);
    window.crypto.getRandomValues(arr);
    var str = base64_urlencode(dec2bin(arr));
    return str.substring(0, len);
  }

  function generate_code_verifier() {
    return random_string(48);
  }

  function generate_code_challenge(verifier) {
    return base64_urlencode(sha256bin(verifier));
  }
  
  var sha256 = function sha256(ascii) {
    function rightRotate(value, amount) {
      return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j; // Used as a counter across the whole file
    var result = '';
  
    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/
  
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
        k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
      }
    }
    
    ascii += '\x80'; // Append '1' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00'; // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j>>8) return; // ASCII check: only accept characters in range 0-255
      words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
      var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
      var oldHash = hash;
      // This is now the "working hash", often labelled as variables a...g
      // (we have to truncate as well, otherwise extra entries at the end accumulate
      hash = hash.slice(0, 8);
      
      for (i = 0; i < 64; i++) {
        var i2 = i + j;
        // Expand the message into 64 words
        // Used below if 
        var w15 = w[i - 15], w2 = w[i - 2];
  
        // Iterate
        var a = hash[0], e = hash[4];
        var temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
          + ((e&hash[5])^((~e)&hash[6])) // ch
          + k[i]
          // Expand the message schedule if needed
          + (w[i] = (i < 16) ? w[i] : (
              w[i - 16]
              + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
              + w[i - 7]
              + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
            )|0
          );
        // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
        var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
          + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
        
        hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
        hash[4] = (hash[4] + temp1)|0;
      }
      
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i])|0;
      }
    }
    
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i]>>(j*8))&255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  };
  
  function login() {
    //const codeVerifier = createCodeVerifier();

    // Example usage:
    // const codeVerifier = generateCodeVerifier();
    const codeVerifier = "NtptupW-ci8UnSVDdvTnwUPHK0NStf8O6la4Q8PEbAAc8Mep";
    // const codeChallenge = generateCodeChallenge(codeVerifier);
    const codeChallenge = generate_code_challenge(codeVerifier);
    // const codeChallenge = "RqDljZ9LzbzTo59YVprQIriRL5gk4CAfMGGodUnQKa8";

    console.log('Code Verifier:', codeVerifier);
    console.log('Code Challenge:', codeChallenge);
    debugger;

    const generatedState = generateRandomState();
    localStorage.setItem('savedStateValue', generatedState);
    localStorage.setItem('savedCodeVerifierValue', codeVerifier);

    const authorizationUrl =
        `${authConfig.authorizationUrl}?client_id=${authConfig.clientId}&redirect_uri=${encodeURIComponent(authConfig.redirectUri)}` +
        `&response_type=code&scope=${encodeURIComponent(authConfig.scope)}&code_challenge=${codeChallenge}&state=${generatedState}` +
        '&code_challenge_method=S256';
  
      // Open the authorization URL in a new window or redirect the current window
      debugger;
      window.location.href = authorizationUrl;

    // createCodeChallenge(codeVerifier).then(codeChallenge => {
    //   const authorizationUrl =
    //     `${authConfig.authorizationUrl}?client_id=${authConfig.clientId}&redirect_uri=${encodeURIComponent(authConfig.redirectUri)}` +
    //     `&response_type=code&scope=${encodeURIComponent(authConfig.scope)}&code_challenge=${codeChallenge}&state=${generatedState}` +
    //     '&code_challenge_method=S256';
  
    //   // Open the authorization URL in a new window or redirect the current window
    //   window.location.href = authorizationUrl;
    // });
  }
  
  function handleCallback() {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
  
    const stateValue = localStorage.getItem('savedStateValue');
    const codeVerifierValue = localStorage.getItem('savedCodeVerifierValue');
    debugger;

    if (code) {
      // Exchange the code for an access token
      // in LP world, you will send the code and codeVerifer value in LP's getAuthenitcationJWT callback
      const tokenUrl =
        `${authConfig.tokenUrl}?client_id=${authConfig.clientId}&redirect_uri=${authConfig.redirectUri}` +
        `&grant_type=authorization_code&code=${code}&code_verifier=${codeVerifierValue}`;
  
      fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => response.json())
        .then(data => {
          accessToken = data.access_token;
          console.log('Access Token:', accessToken);
        })
        .catch(error => console.error('Error exchanging code for token:', error))
        .finally(() => {
          // Clear the query parameters from the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }
  
  function logout() {
    accessToken = null;
    console.log('User logged out');
  }
  
  // Check for the authorization code in the URL when the page loads
  handleCallback();
  