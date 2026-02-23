# Task 2 – Prompt Engineering

## Login Module – Prompt V1

You are a senior QA automation architect working on a SaaS web application.

Context:
The application is a web-based test management platform.
It includes:
- JWT authentication
- Role-based access control
- Dashboard with widgets
- REST APIs

Your task:
Generate structured test cases for the [MODULE_NAME] module.

Requirements:
- Include positive cases
- Include negative cases
- Include boundary value scenarios
- Include security edge cases
- Include validation checks
- Avoid redundant scenarios
- Ensure realistic test coverage

Output format:
Return only JSON in the following structure:

{
  "module": "Module Name",
  "testCases": [
    {
      "id": "TC_001",
      "title": "Short description",
      "preconditions": [],
      "steps": [],
      "expectedResult": ""
    }
  ]
}

Do not include explanations.
Do not include markdown.
Return valid JSON only.

### Raw Output V1

{                                                                                                                                                                          
    "module": "Login",
    "testCases": [                                                                                                                                                           
      {          
        "id": "TC_001",                                                                                                                                                      
        "title": "Successful login with valid admin credentials",                                                                                                            
        "preconditions": [
          "User account with admin role exists and is active",
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a valid admin email address",
          "Enter the correct password",
          "Click the Login button"
        ],
        "expectedResult": "User is authenticated, JWT token is issued, and user is redirected to the admin dashboard with admin-level widgets visible"
      },
      {
        "id": "TC_002",
        "title": "Successful login with valid viewer-role credentials",
        "preconditions": [
          "User account with viewer role exists and is active"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a valid viewer-role email address",
          "Enter the correct password",
          "Click the Login button"
        ],
        "expectedResult": "User is authenticated and redirected to the dashboard showing only widgets permitted for the viewer role"
      },
      {
        "id": "TC_003",
        "title": "Login fails with incorrect password",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a valid registered email address",
          "Enter an incorrect password",
          "Click the Login button"
        ],
        "expectedResult": "Login is rejected. An error message such as 'Invalid email or password' is displayed. No JWT token is issued."
      },
      {
        "id": "TC_004",
        "title": "Login fails with unregistered email address",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter an email address that does not exist in the system",
          "Enter any password",
          "Click the Login button"
        ],
        "expectedResult": "Login is rejected with a generic error message. The response does not reveal whether the email exists in the system."
      },
      {
        "id": "TC_005",
        "title": "Login fails with empty email field",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Leave the email field blank",
          "Enter any password",
          "Click the Login button"
        ],
        "expectedResult": "Form submission is blocked. A validation error such as 'Email is required' is displayed on the email field."
      },
      {
        "id": "TC_006",
        "title": "Login fails with empty password field",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a valid registered email address",
          "Leave the password field blank",
          "Click the Login button"
        ],
        "expectedResult": "Form submission is blocked. A validation error such as 'Password is required' is displayed on the password field."
      },
      {
        "id": "TC_007",
        "title": "Login fails when both fields are empty",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Leave both email and password fields blank",
          "Click the Login button"
        ],
        "expectedResult": "Form submission is blocked. Validation errors are displayed on both the email and password fields."
      },
      {
        "id": "TC_008",
        "title": "Login fails with invalid email format",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a malformed email string such as 'userATdomain.com'",
          "Enter any password",
          "Click the Login button"
        ],
        "expectedResult": "Form submission is blocked. A validation error indicating an invalid email format is displayed."
      },
      {
        "id": "TC_009",
        "title": "Login fails for a deactivated user account",
        "preconditions": [
          "A user account exists but has been deactivated by an admin"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter the email of the deactivated account",
          "Enter the correct password",
          "Click the Login button"
        ],
        "expectedResult": "Login is rejected. An appropriate error message such as 'Account is disabled. Contact your administrator.' is displayed."
      },
      {
        "id": "TC_010",
        "title": "Account lockout after maximum consecutive failed login attempts",
        "preconditions": [
          "A valid user account exists",
          "Account lockout policy is configured (e.g., 5 consecutive failures)"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter the correct email and an incorrect password",
          "Repeat step 2 until the configured maximum attempt threshold is reached"
        ],
        "expectedResult": "Account is locked after the threshold is reached. A lockout message is displayed. Subsequent login attempts with the correct password also fail
  until the lockout is resolved."
      },
      {
        "id": "TC_011",
        "title": "Password field input is masked",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Click into the password field and type any characters"
        ],
        "expectedResult": "All characters entered in the password field are displayed as masked characters (e.g., dots or asterisks)."
      },
      {
        "id": "TC_012",
        "title": "JWT token is not exposed in the URL after login",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter valid credentials and log in",
          "Inspect the browser address bar after successful login"
        ],
        "expectedResult": "The JWT token is not present in the URL. The token is stored in an HttpOnly cookie or application memory only."
      },
      {
        "id": "TC_013",
        "title": "SQL injection in email field does not compromise authentication",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a SQL injection payload in the email field, e.g., \"' OR '1'='1\"",
          "Enter any value in the password field",
          "Click the Login button"
        ],
        "expectedResult": "Login is rejected. The application handles the input safely without executing any unintended database query. No error stack trace is exposed."
      },
      {
        "id": "TC_014",
        "title": "XSS payload in email field is not executed",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter an XSS payload in the email field, e.g., \"<script>alert('xss')</script>\"",
          "Enter any value in the password field",
          "Click the Login button"
        ],
        "expectedResult": "The script is not executed. The input is sanitized or escaped. A standard validation or login failure message is displayed."
      },
      {
        "id": "TC_015",
        "title": "Login page is served over HTTPS",
        "preconditions": [
          "Application is deployed in a production-like environment"
        ],
        "steps": [
          "Attempt to access the login page over HTTP",
          "Observe the browser behavior"
        ],
        "expectedResult": "The request is automatically redirected to HTTPS. The login page is never served over an unencrypted connection."
      },
      {
        "id": "TC_016",
        "title": "Successful login response sets a secure, HttpOnly cookie",
        "preconditions": [
          "A valid user account exists",
          "Browser developer tools are available"
        ],
        "steps": [
          "Navigate to the login page",
          "Log in with valid credentials",
          "Open browser developer tools and inspect cookies"
        ],
        "expectedResult": "The session or JWT cookie has the Secure and HttpOnly flags set. The SameSite attribute is set to Strict or Lax."
      },
      {
        "id": "TC_017",
        "title": "Email field accepts maximum allowed character length",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter an email address exactly at the maximum allowed length (e.g., 254 characters per RFC 5321)",
          "Enter any password",
          "Click the Login button"
        ],
        "expectedResult": "The field accepts the input without truncation. The login attempt proceeds to server-side validation."
      },
      {
        "id": "TC_018",
        "title": "Email field rejects input exceeding maximum character length",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter an email address that exceeds the maximum allowed length (e.g., 255+ characters)",
          "Enter any password",
          "Click the Login button"
        ],
        "expectedResult": "The input is rejected either by the field itself (truncation or block) or by a validation error before submission."
      },
      {
        "id": "TC_019",
        "title": "Password field enforces minimum length validation",
        "preconditions": [
          "Application is accessible",
          "Minimum password length policy is defined (e.g., 8 characters)"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a valid email address",
          "Enter a password shorter than the minimum required length",
          "Click the Login button"
        ],
        "expectedResult": "Login is rejected. A validation message indicating the password does not meet the minimum length requirement is displayed."
      },
      {
        "id": "TC_020",
        "title": "JWT token expires after the configured session duration",
        "preconditions": [
          "A valid user account exists",
          "JWT expiry is configured (e.g., 60 minutes)"
        ],
        "steps": [
          "Log in with valid credentials",
          "Allow the session to remain idle past the configured JWT expiry time",
          "Attempt to perform an authenticated action or navigate to a protected page"
        ],
        "expectedResult": "The expired JWT is rejected. The user is redirected to the login page with an appropriate session expiry message."
      },
      {
        "id": "TC_021",
        "title": "Accessing a protected route without a JWT redirects to login",
        "preconditions": [
          "User is not logged in"
        ],
        "steps": [
          "Without logging in, directly navigate to a protected URL such as '/dashboard'"
        ],
        "expectedResult": "The application redirects the user to the login page. The protected content is not rendered."
      },
      {
        "id": "TC_022",
        "title": "Login with email address using mixed case is handled correctly",
        "preconditions": [
          "A user account exists with a lowercase email address"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter the registered email address with mixed uppercase and lowercase characters (e.g., 'User@Domain.COM')",
          "Enter the correct password",
          "Click the Login button"
        ],
        "expectedResult": "Login succeeds, as email matching is case-insensitive. The user is authenticated normally."
      },
      {
        "id": "TC_023",
        "title": "Login with leading or trailing whitespace in email field",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter the registered email with a leading or trailing space (e.g., ' user@domain.com ')",
          "Enter the correct password",
          "Click the Login button"
        ],
        "expectedResult": "The application trims the whitespace and authenticates the user successfully, or displays a clear validation error."
      },
      {
        "id": "TC_024",
        "title": "Brute-force protection is active via rate limiting on the login endpoint",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Send a high volume of login requests to the login endpoint in rapid succession from the same IP address"
        ],
        "expectedResult": "After exceeding the rate limit threshold, subsequent requests receive a 429 Too Many Requests response. Further attempts are temporarily blocked."
      },
      {
        "id": "TC_025",
        "title": "A tampered JWT is rejected by the application",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Log in with valid credentials and obtain the JWT token",
          "Manually alter the payload portion of the JWT (e.g., change the role claim)",
          "Send a request to a protected API endpoint using the tampered token"
        ],
        "expectedResult": "The server rejects the tampered token with a 401 Unauthorized response. Access is denied."
      },
      {
        "id": "TC_026",
        "title": "Login form is protected against CSRF",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Craft a cross-site request that submits login credentials to the application's login endpoint",
          "Send the forged request from a different origin"
        ],
        "expectedResult": "The request is rejected. The application validates the CSRF token or SameSite cookie policy prevents the cross-site submission."
      },
      {
        "id": "TC_027",
        "title": "Logout invalidates the JWT and clears the session",
        "preconditions": [
          "A user is currently logged in"
        ],
        "steps": [
          "Log in with valid credentials",
          "Click the Logout button",
          "Attempt to use the previously issued JWT to access a protected endpoint"
        ],
        "expectedResult": "After logout, the JWT is invalidated server-side (if using a blocklist) or the cookie is cleared. Using the old token does not grant access."
      },
      {
        "id": "TC_028",
        "title": "Login page does not autofill password from browser on shared devices",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Inspect the password input element's autocomplete attribute"
        ],
        "expectedResult": "The password field has autocomplete set to 'current-password' or 'off' to control autofill behavior appropriately for the security context."
      }
    ]
  }

  ### Refinement Prompt V2

  You are a senior QA automation architect.

Refine the previous Login module test cases with the following adjustments:

1. Separate UI-level test cases from API-level test cases.
2. Add concurrency scenarios (e.g., multiple simultaneous login attempts).
3. Add UX behavior validation (button disabled state, loading spinner).
4. Add browser navigation edge case (back button after logout).
5. Keep security scenarios realistic for automation scope.
6. Remove redundant infrastructure-only checks (e.g., HTTPS enforcement).

Return structured JSON in this format:

{
  "module": "Login",
  "uiTests": [],
  "apiTests": []
}

Return valid JSON only.
No explanations.
No markdown.

### Raw Output V2

{                                                                                                                                                                          
    "module": "Login",                                                                                          
    "uiTests": [                                                                                                                                                             
      {                                                                                                                                                                      
        "id": "UI_001",                                                                                                                                                      
        "title": "Successful login with valid admin credentials redirects to admin dashboard",                                                                               
        "preconditions": [                                                                                                                                                   
          "An active user account with admin role exists"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a valid admin email address",
          "Enter the correct password",
          "Click the Login button"
        ],
        "expectedResult": "User is redirected to the admin dashboard. Admin-specific widgets and navigation options are visible."
      },
      {
        "id": "UI_002",
        "title": "Successful login with valid viewer credentials redirects to restricted dashboard",
        "preconditions": [
          "An active user account with viewer role exists"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a valid viewer-role email address",
          "Enter the correct password",
          "Click the Login button"
        ],
        "expectedResult": "User is redirected to the dashboard showing only widgets and navigation permitted for the viewer role. Admin-only sections are absent."
      },
      {
        "id": "UI_003",
        "title": "Login button is disabled and loading spinner appears during request processing",
        "preconditions": [
          "An active user account exists",
          "Network can be throttled via browser dev tools"
        ],
        "steps": [
          "Navigate to the login page",
          "Throttle the network to simulate slow response",
          "Enter valid credentials",
          "Click the Login button",
          "Immediately observe the button state and UI"
        ],
        "expectedResult": "The Login button becomes disabled immediately after click. A loading spinner or progress indicator is visible. The button remains disabled until
  the server response is received, preventing duplicate submission."
      },
      {
        "id": "UI_004",
        "title": "Login button is disabled when both fields are empty on page load",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Observe the Login button state without entering any input"
        ],
        "expectedResult": "The Login button is disabled or visually inactive on initial page load when both fields are empty."
      },
      {
        "id": "UI_005",
        "title": "Inline validation error appears on empty email submission",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Leave the email field blank",
          "Enter any value in the password field",
          "Click the Login button"
        ],
        "expectedResult": "Form submission is blocked. An inline validation message such as 'Email is required' appears adjacent to the email field."
      },
      {
        "id": "UI_006",
        "title": "Inline validation error appears on empty password submission",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a valid email address",
          "Leave the password field blank",
          "Click the Login button"
        ],
        "expectedResult": "Form submission is blocked. An inline validation message such as 'Password is required' appears adjacent to the password field."
      },
      {
        "id": "UI_007",
        "title": "Inline validation error appears for malformed email format",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a malformed email string such as 'userATdomain' or 'user@'",
          "Enter any password",
          "Click the Login button or trigger field blur"
        ],
        "expectedResult": "An inline validation error indicating an invalid email format is displayed. The form is not submitted."
      },
      {
        "id": "UI_008",
        "title": "Password field input is masked at all times",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Click into the password field and type any characters"
        ],
        "expectedResult": "All characters entered are displayed as masked symbols. The raw password text is never visible in the field."
      },
      {
        "id": "UI_009",
        "title": "Incorrect credentials display a generic error without revealing account existence",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter a valid registered email with an incorrect password",
          "Click the Login button",
          "Repeat with an unregistered email and any password"
        ],
        "expectedResult": "Both attempts display the same generic error message such as 'Invalid email or password'. The message does not differentiate between a wrong
  password and a non-existent account."
      },
      {
        "id": "UI_010",
        "title": "Deactivated account login displays an account-specific error message",
        "preconditions": [
          "A user account exists but has been deactivated by an admin"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter the email and correct password for the deactivated account",
          "Click the Login button"
        ],
        "expectedResult": "An error message such as 'Your account has been disabled. Contact your administrator.' is displayed. The user is not authenticated."
      },
      {
        "id": "UI_011",
        "title": "Account lockout error message is shown after maximum failed attempts",
        "preconditions": [
          "A valid user account exists",
          "Lockout policy is set to a known threshold (e.g., 5 attempts)"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter the correct email and an incorrect password",
          "Repeat until the lockout threshold is reached"
        ],
        "expectedResult": "After the final failed attempt, a lockout message such as 'Account locked due to multiple failed attempts. Try again in X minutes.' is displayed."
      },
      {
        "id": "UI_012",
        "title": "Browser back button after logout does not render protected content",
        "preconditions": [
          "User is logged in and on the dashboard"
        ],
        "steps": [
          "Log out using the application logout control",
          "Verify the user is redirected to the login page",
          "Press the browser back button"
        ],
        "expectedResult": "The browser does not display the previously cached dashboard. The user remains on the login page or is redirected back to it. Protected content is
   not accessible."
      },
      {
        "id": "UI_013",
        "title": "Email field is case-insensitive on login",
        "preconditions": [
          "A user account exists with a lowercase email address"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter the registered email with mixed case characters (e.g., 'User@Domain.COM')",
          "Enter the correct password",
          "Click the Login button"
        ],
        "expectedResult": "Login succeeds. The email is matched case-insensitively and the user is authenticated normally."
      },
      {
        "id": "UI_014",
        "title": "Leading and trailing whitespace in the email field is trimmed before submission",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter the registered email with a leading and trailing space (e.g., ' user@domain.com ')",
          "Enter the correct password",
          "Click the Login button"
        ],
        "expectedResult": "The application trims the whitespace and authenticates the user successfully, or displays a clear format validation error."
      },
      {
        "id": "UI_015",
        "title": "XSS payload entered in the email field is not executed",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter the payload \"<script>alert('xss')</script>\" in the email field",
          "Enter any password",
          "Click the Login button"
        ],
        "expectedResult": "No script executes. The input is sanitized or escaped. A standard validation or authentication failure message is displayed."
      },
      {
        "id": "UI_016",
        "title": "Remember me checkbox persists session across browser restart",
        "preconditions": [
          "A valid user account exists",
          "A 'Remember Me' option is present on the login form"
        ],
        "steps": [
          "Navigate to the login page",
          "Enter valid credentials",
          "Check the 'Remember Me' checkbox",
          "Click Login",
          "Close and reopen the browser",
          "Navigate to the application URL"
        ],
        "expectedResult": "The user is still authenticated and directed to the dashboard without being prompted to log in again."
      }
    ],
    "apiTests": [
      {
        "id": "API_001",
        "title": "Valid credentials return 200 with a well-formed JWT token",
        "preconditions": [
          "An active user account exists"
        ],
        "steps": [
          "Send a POST request to /api/auth/login with a valid email and password in the request body"
        ],
        "expectedResult": "Response status is 200. The body contains a JWT token with three dot-separated segments (header.payload.signature). The token payload includes
  expected claims such as sub, role, and exp."
      },
      {
        "id": "API_002",
        "title": "Invalid password returns 401 with a generic error body",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Send a POST request to /api/auth/login with a valid email and an incorrect password"
        ],
        "expectedResult": "Response status is 401. The response body contains a generic error message. No stack trace, user ID, or internal detail is exposed."
      },
      {
        "id": "API_003",
        "title": "Unregistered email returns 401 with the same response as an incorrect password",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Send a POST request to /api/auth/login with an email address not present in the system and any password",
          "Compare the response status code and body to the response from API_002"
        ],
        "expectedResult": "Response status is 401. The response body and response time are indistinguishable from the invalid password case, preventing account enumeration."
      },
      {
        "id": "API_004",
        "title": "Deactivated account login returns 403",
        "preconditions": [
          "A user account exists but has been deactivated"
        ],
        "steps": [
          "Send a POST request to /api/auth/login with the deactivated account's email and correct password"
        ],
        "expectedResult": "Response status is 403. The response body indicates the account is disabled without exposing internal account state details."
      },
      {
        "id": "API_005",
        "title": "SQL injection payload in email field does not compromise authentication",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Send a POST request to /api/auth/login with the email value set to \"' OR '1'='1' --\" and any password value"
        ],
        "expectedResult": "Response status is 400 or 401. Authentication is not granted. No SQL error or internal exception detail is present in the response."
      },
      {
        "id": "API_006",
        "title": "Rate limiting returns 429 after exceeding the request threshold",
        "preconditions": [
          "Rate limiting is configured on the login endpoint (e.g., 10 requests per minute per IP)"
        ],
        "steps": [
          "Send POST requests to /api/auth/login in rapid succession from the same IP address, exceeding the configured threshold"
        ],
        "expectedResult": "Once the threshold is exceeded, subsequent responses return status 429 with a Retry-After header indicating when requests can resume."
      },
      {
        "id": "API_007",
        "title": "Account lockout is triggered after the configured number of consecutive failed API attempts",
        "preconditions": [
          "A valid user account exists",
          "Lockout threshold is known (e.g., 5 consecutive failures)"
        ],
        "steps": [
          "Send POST requests to /api/auth/login with the correct email and an incorrect password, repeating until the lockout threshold is reached",
          "Send one additional request with the correct password"
        ],
        "expectedResult": "After the threshold, the account is locked. The final request with the correct password returns a 403 or 401 with a lockout-specific error code or
   message."
      },
      {
        "id": "API_008",
        "title": "Expired JWT is rejected on a protected endpoint",
        "preconditions": [
          "A valid user account exists",
          "A JWT with a past exp claim can be crafted or obtained"
        ],
        "steps": [
          "Obtain or construct a JWT token with an expiry timestamp in the past",
          "Send a GET request to a protected endpoint (e.g., /api/dashboard) with the expired token in the Authorization header"
        ],
        "expectedResult": "Response status is 401. The response body indicates the token has expired. Access to the protected resource is denied."
      },
      {
        "id": "API_009",
        "title": "Tampered JWT signature is rejected on a protected endpoint",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Log in via the API to obtain a valid JWT",
          "Alter the payload segment of the JWT (e.g., change the role claim to 'admin')",
          "Send a GET request to a protected endpoint using the tampered token"
        ],
        "expectedResult": "Response status is 401. The server detects the invalid signature and denies access."
      },
      {
        "id": "API_010",
        "title": "Request to a protected endpoint without a JWT returns 401",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Send a GET request to a protected endpoint (e.g., /api/dashboard) with no Authorization header or session cookie"
        ],
        "expectedResult": "Response status is 401. The response body indicates authentication is required."
      },
      {
        "id": "API_011",
        "title": "Logout invalidates the JWT and subsequent use returns 401",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Send a POST request to /api/auth/login and store the returned JWT",
          "Send a POST request to /api/auth/logout with the JWT",
          "Send a GET request to a protected endpoint using the same JWT"
        ],
        "expectedResult": "After logout, the JWT is invalidated server-side. The protected endpoint returns 401, confirming the token is no longer accepted."
      },
      {
        "id": "API_012",
        "title": "Concurrent login requests from the same account create independent valid sessions",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Send 5 simultaneous POST requests to /api/auth/login with the same valid credentials"
        ],
        "expectedResult": "All 5 requests return 200. Each response contains a distinct, independently valid JWT token. No race condition error or partial failure occurs."
      },
      {
        "id": "API_013",
        "title": "Concurrent failed login attempts from multiple clients correctly increment the lockout counter",
        "preconditions": [
          "A valid user account exists",
          "Lockout threshold is known (e.g., 5 failures)"
        ],
        "steps": [
          "Send the exact lockout threshold number of simultaneous POST requests to /api/auth/login with the correct email and an incorrect password",
          "Send one additional request with the correct password immediately after"
        ],
        "expectedResult": "The lockout counter is not under-counted due to a race condition. The account is locked as expected. The final request with the correct password
  is denied."
      },
      {
        "id": "API_014",
        "title": "Concurrent login and logout requests do not result in an authenticated state after logout",
        "preconditions": [
          "A valid user account exists"
        ],
        "steps": [
          "Log in via the API to obtain a JWT",
          "Send a POST request to /api/auth/logout and a GET request to a protected endpoint simultaneously using the same JWT"
        ],
        "expectedResult": "Regardless of processing order, after the logout completes, the JWT is no longer accepted. The protected endpoint returns 401 on any subsequent
  request with the invalidated token."
      },
      {
        "id": "API_015",
        "title": "Login endpoint rejects request body with missing required fields and returns 400",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Send a POST request to /api/auth/login with an empty JSON body {}",
          "Send a POST request with only the email field present",
          "Send a POST request with only the password field present"
        ],
        "expectedResult": "All three requests return status 400. The response body identifies which required fields are missing."
      },
      {
        "id": "API_016",
        "title": "Login endpoint enforces maximum email length and returns 400 for oversized input",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Send a POST request to /api/auth/login with an email value exceeding 254 characters"
        ],
        "expectedResult": "Response status is 400. The server rejects the oversized input before any database query is executed. No server error is returned."
      },
      {
        "id": "API_017",
        "title": "Login response does not include sensitive server headers",
        "preconditions": [
          "Application is accessible"
        ],
        "steps": [
          "Send a POST request to /api/auth/login with any credentials",
          "Inspect all response headers"
        ],
        "expectedResult": "The response does not include headers that reveal server technology details such as X-Powered-By, Server version strings, or internal framework
  identifiers."
      },
      {
        "id": "API_018",
        "title": "Login with correct credentials after a lockout period expires succeeds",
        "preconditions": [
          "A user account is currently locked",
          "The lockout duration is known (e.g., 15 minutes)"
        ],
        "steps": [
          "Wait for the lockout period to expire",
          "Send a POST request to /api/auth/login with the correct credentials"
        ],
        "expectedResult": "Response status is 200. A valid JWT is returned. The lockout counter is reset."
      }
    ]
  }

  ### Login Module – Prompt Refinement Notes

The initial prompt generated comprehensive coverage but mixed UI, API, and infrastructure-level concerns in a single list. Some scenarios were overly backend-focused (e.g., HTTPS enforcement) and not clearly separable for automation layers. 

I refined the prompt to:
- Explicitly separate UI-level and API-level tests.
- Add concurrency scenarios and UX behavior validation.
- Remove infrastructure-only cases.
- Enforce strict JSON structure for better machine readability.

The refined prompt produced clearer separation of concerns and improved automation feasibility.