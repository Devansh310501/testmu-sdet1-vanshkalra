# Task 2 – Prompt Engineering

## RestAPI Module – Prompt V1
You are a senior QA automation architect designing API regression coverage for a SaaS test management platform.

Module: REST API

Context:
The application exposes RESTful endpoints for managing test artifacts such as:
- Test Suites
- Test Cases
- Test Runs

Authentication:
- JWT-based authentication via Authorization: Bearer <token>
- Role-based access control (Admin, Manager, Viewer)

Your task:
Generate structured API regression test cases covering:

1. Auth token validation
   - Missing token
   - Expired token
   - Tampered token
   - Insufficient role permissions

2. CRUD operations for a representative entity (e.g., Test Cases)
   - Create
   - Read (single + list)
   - Update
   - Delete
   - Idempotency checks where applicable

3. Error handling
   - 400 validation errors
   - 401 unauthorized
   - 403 forbidden
   - 404 not found
   - 409 conflict
   - 500 internal server error

4. Rate limiting behavior (429 handling)

5. Schema validation
   - Required fields
   - Field types
   - Boundary value validation
   - Maximum length enforcement

6. Include at least 3 concurrency scenarios (e.g., simultaneous updates, duplicate creation race condition).

Constraints:
- Avoid UI-level checks.
- Focus strictly on API behavior.
- Ensure automation feasibility.
- Avoid redundant scenarios.

Return JSON only in this structure:

{
  "module": "REST API",
  "authTests": [],
  "crudTests": [],
  "errorHandlingTests": [],
  "rateLimitTests": [],
  "schemaValidationTests": [],
  "concurrencyTests": []
}

Each test case must contain:
{
  "id": "",
  "title": "",
  "preconditions": [],
  "steps": [],
  "expectedResult": ""
}

Return valid JSON only.
Do not include markdown.
Do not include explanations.

### Raw Output V1

{                                 
    "module": "REST API",                     
    "authTests": [
      {                                                                                                                                                     
        "id": "AUTH-001",
        "title": "Request with missing Authorization header returns 401",                                                                                   
        "preconditions": [
          "A valid test case ID exists in the system"
        ],
        "steps": [
          "Send GET /api/v1/test-cases/{id} with no Authorization header",
          "Validate the HTTP status code",
          "Validate the response body"
        ],
        "expectedResult": "HTTP 401 Unauthorized is returned; response body contains an error code such as 'MISSING_TOKEN' and a descriptive message; no
  resource data is returned"
      },
      {
        "id": "AUTH-002",
        "title": "Request with expired JWT returns 401",
        "preconditions": [
          "A JWT that has passed its exp claim timestamp is available",
          "A valid test case ID exists in the system"
        ],
        "steps": [
          "Send GET /api/v1/test-cases/{id} with Authorization: Bearer <expired_token>",
          "Validate the HTTP status code",
          "Validate the response body error code"
        ],
        "expectedResult": "HTTP 401 Unauthorized is returned; response body contains an error code such as 'TOKEN_EXPIRED'; no resource data is returned"
      },
      {
        "id": "AUTH-003",
        "title": "Request with tampered JWT signature returns 401",
        "preconditions": [
          "A valid JWT is available",
          "The JWT signature segment has been altered by one or more characters"
        ],
        "steps": [
          "Modify the signature portion of a valid JWT (third segment)",
          "Send GET /api/v1/test-cases with Authorization: Bearer <tampered_token>",
          "Validate the HTTP status code and response body"
        ],
        "expectedResult": "HTTP 401 Unauthorized is returned; response body contains an error code such as 'INVALID_TOKEN_SIGNATURE'; no data is returned"
      },
      {
        "id": "AUTH-004",
        "title": "Request with a structurally malformed JWT returns 401",
        "preconditions": [
          "No valid JWT is required for this test"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with Authorization: Bearer not.a.valid.jwt.format",
          "Validate the HTTP status code and response body"
        ],
        "expectedResult": "HTTP 401 Unauthorized is returned; response body contains an error code indicating the token is malformed; server does not throw
  an unhandled 500"
      },
      {
        "id": "AUTH-005",
        "title": "Viewer role JWT is forbidden from creating a test case",
        "preconditions": [
          "A valid JWT for a user with Viewer role is available",
          "A target test suite ID exists"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with Authorization: Bearer <viewer_jwt> and a valid request body",
          "Validate the HTTP status code and response body"
        ],
        "expectedResult": "HTTP 403 Forbidden is returned; response body specifies insufficient permissions; no test case is created"
      },
      {
        "id": "AUTH-006",
        "title": "Viewer role JWT is forbidden from deleting a test case",
        "preconditions": [
          "A valid JWT for a Viewer role user is available",
          "A test case ID exists that the Viewer has read access to"
        ],
        "steps": [
          "Send DELETE /api/v1/test-cases/{id} with Authorization: Bearer <viewer_jwt>",
          "Validate the HTTP status code",
          "Send GET /api/v1/test-cases/{id} with an Admin JWT to confirm the resource still exists"
        ],
        "expectedResult": "HTTP 403 Forbidden is returned on the DELETE; the test case remains present and retrievable by the Admin"
      },
      {
        "id": "AUTH-007",
        "title": "Manager role JWT is permitted to update but not delete a test case if role policy restricts delete to Admin",
        "preconditions": [
          "Role policy designates DELETE as Admin-only",
          "A valid JWT for a Manager role user is available",
          "An existing test case ID is available"
        ],
        "steps": [
          "Send PATCH /api/v1/test-cases/{id} with Authorization: Bearer <manager_jwt> and a valid update body",
          "Validate that the update succeeds",
          "Send DELETE /api/v1/test-cases/{id} with Authorization: Bearer <manager_jwt>",
          "Validate the DELETE response"
        ],
        "expectedResult": "PATCH returns HTTP 200 and the updated resource; DELETE returns HTTP 403 Forbidden"
      }
    ],
    "crudTests": [
      {
        "id": "CRUD-001",
        "title": "POST /api/v1/test-cases creates a new test case and returns 201 with the created resource",
        "preconditions": [
          "A valid Admin or Manager JWT is available",
          "A valid test suite ID exists to associate the test case"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with a valid JSON body containing title, description, priority, and suiteId",
          "Validate the HTTP status code",
          "Validate the response body fields",
          "Send GET /api/v1/test-cases/{returned_id} to confirm persistence"
        ],
        "expectedResult": "HTTP 201 Created is returned; response body contains the created test case with a system-generated id, timestamps, and all
  submitted fields; subsequent GET returns the same resource"
      },
      {
        "id": "CRUD-002",
        "title": "GET /api/v1/test-cases/{id} returns the correct test case for a valid ID",
        "preconditions": [
          "A valid JWT is available",
          "A test case with a known ID and known field values exists"
        ],
        "steps": [
          "Send GET /api/v1/test-cases/{known_id} with a valid JWT",
          "Validate the HTTP status code",
          "Validate each field in the response against known values"
        ],
        "expectedResult": "HTTP 200 OK is returned; response body exactly matches the known test case fields including id, title, description, priority,
  status, suiteId, createdAt, and updatedAt"
      },
      {
        "id": "CRUD-003",
        "title": "GET /api/v1/test-cases returns a paginated list of test cases for the authenticated user's scope",
        "preconditions": [
          "A valid JWT is available",
          "More than one page of test cases exists (e.g., more than 20)"
        ],
        "steps": [
          "Send GET /api/v1/test-cases?page=1&limit=20 with a valid JWT",
          "Record the returned item IDs and totalCount",
          "Send GET /api/v1/test-cases?page=2&limit=20",
          "Verify no ID overlap between page 1 and page 2"
        ],
        "expectedResult": "HTTP 200 is returned for both requests; page 1 and page 2 each contain up to 20 items with no duplicate IDs; totalCount is
  consistent across both responses; a next page link or hasMore flag is present where applicable"
      },
      {
        "id": "CRUD-004",
        "title": "PUT /api/v1/test-cases/{id} fully replaces the test case and returns 200 with updated resource",
        "preconditions": [
          "A valid Admin or Manager JWT is available",
          "An existing test case ID is available"
        ],
        "steps": [
          "Send PUT /api/v1/test-cases/{id} with a complete valid replacement body (all required fields)",
          "Validate the HTTP status code",
          "Validate the response body reflects all submitted values",
          "Send GET /api/v1/test-cases/{id} to confirm persistence"
        ],
        "expectedResult": "HTTP 200 OK is returned; all fields in the response match the submitted body; updatedAt timestamp is more recent than the
  original; subsequent GET reflects the replacement"
      },
      {
        "id": "CRUD-005",
        "title": "PATCH /api/v1/test-cases/{id} partially updates only specified fields without affecting others",
        "preconditions": [
          "A valid Admin or Manager JWT is available",
          "An existing test case with known field values is available"
        ],
        "steps": [
          "Send PATCH /api/v1/test-cases/{id} with a body containing only the 'priority' field",
          "Validate the HTTP status code",
          "Validate that 'priority' is updated in the response",
          "Validate that all other fields remain unchanged"
        ],
        "expectedResult": "HTTP 200 OK is returned; only the 'priority' field reflects the new value; all other fields (title, description, status, suiteId)
   remain unchanged from their pre-patch values"
      },
      {
        "id": "CRUD-006",
        "title": "DELETE /api/v1/test-cases/{id} removes the resource and subsequent GET returns 404",
        "preconditions": [
          "A valid Admin JWT is available",
          "An existing test case ID is available"
        ],
        "steps": [
          "Send DELETE /api/v1/test-cases/{id} with a valid Admin JWT",
          "Validate the HTTP status code",
          "Send GET /api/v1/test-cases/{id} with a valid JWT",
          "Validate the GET response"
        ],
        "expectedResult": "DELETE returns HTTP 204 No Content or HTTP 200 with a confirmation body; subsequent GET returns HTTP 404 Not Found"
      },
      {
        "id": "CRUD-007",
        "title": "DELETE /api/v1/test-cases/{id} is idempotent — repeated DELETE on same ID returns 404, not 500",
        "preconditions": [
          "A valid Admin JWT is available",
          "An existing test case ID is available"
        ],
        "steps": [
          "Send DELETE /api/v1/test-cases/{id} to delete the resource",
          "Confirm the first DELETE returned 204 or 200",
          "Send DELETE /api/v1/test-cases/{id} again for the same ID"
        ],
        "expectedResult": "Second DELETE returns HTTP 404 Not Found with an appropriate error message; no HTTP 500 or unhandled exception occurs"
      },
      {
        "id": "CRUD-008",
        "title": "GET /api/v1/test-cases supports filtering by status and returns only matching records",
        "preconditions": [
          "A valid JWT is available",
          "Test cases with statuses 'draft' and 'active' exist in the system"
        ],
        "steps": [
          "Send GET /api/v1/test-cases?status=draft with a valid JWT",
          "Inspect every item in the response array"
        ],
        "expectedResult": "HTTP 200 is returned; every returned test case has status equal to 'draft'; no 'active' or other status items appear in the
  response"
      }
    ],
    "errorHandlingTests": [
      {
        "id": "ERR-001",
        "title": "POST /api/v1/test-cases with missing required field 'title' returns 400",
        "preconditions": [
          "A valid Admin JWT is available"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with a body omitting the required 'title' field",
          "Validate the HTTP status code",
          "Validate the error response body"
        ],
        "expectedResult": "HTTP 400 Bad Request is returned; response body contains a validation error referencing 'title' as missing or required; no test
  case is created"
      },
      {
        "id": "ERR-002",
        "title": "POST /api/v1/test-cases with invalid field type returns 400 with field-level error",
        "preconditions": [
          "A valid Admin JWT is available"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with 'priority' set to a string value 'high-priority' instead of an expected enum or integer",
          "Validate the HTTP status code and error body"
        ],
        "expectedResult": "HTTP 400 Bad Request is returned; error body identifies the 'priority' field and describes the type or enum constraint violation;
   no test case is created"
      },
      {
        "id": "ERR-003",
        "title": "GET /api/v1/test-cases/{id} with a non-existent ID returns 404",
        "preconditions": [
          "A valid JWT is available",
          "The ID used does not correspond to any test case in the system"
        ],
        "steps": [
          "Send GET /api/v1/test-cases/nonexistent-id-00000 with a valid JWT",
          "Validate the HTTP status code and response body"
        ],
        "expectedResult": "HTTP 404 Not Found is returned; response body contains an error code such as 'RESOURCE_NOT_FOUND' and a message; no data payload
  is returned"
      },
      {
        "id": "ERR-004",
        "title": "POST /api/v1/test-cases with a duplicate title within the same suite returns 409",
        "preconditions": [
          "A valid Admin JWT is available",
          "A test case with title 'Login Validation' already exists in suite with ID suite-001"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with body containing title 'Login Validation' and suiteId 'suite-001'",
          "Validate the HTTP status code and response body"
        ],
        "expectedResult": "HTTP 409 Conflict is returned; response body contains an error code such as 'DUPLICATE_RESOURCE' indicating the title already
  exists in the suite; no duplicate test case is created"
      },
      {
        "id": "ERR-005",
        "title": "Simulated upstream failure on GET /api/v1/test-cases returns 500 with a safe error message",
        "preconditions": [
          "A valid JWT is available",
          "The database or upstream dependency is mocked to return a connection error"
        ],
        "steps": [
          "Send GET /api/v1/test-cases with a valid JWT while the upstream service is failing",
          "Validate the HTTP status code",
          "Validate that the response body does not expose stack traces or internal system details"
        ],
        "expectedResult": "HTTP 500 Internal Server Error is returned; response body contains a generic error message and a requestId for tracing; no
  internal stack trace, database error text, or sensitive system info is exposed"
      },
      {
        "id": "ERR-006",
        "title": "PATCH /api/v1/test-cases/{id} with an empty request body returns 400",
        "preconditions": [
          "A valid Admin JWT is available",
          "An existing test case ID is available"
        ],
        "steps": [
          "Send PATCH /api/v1/test-cases/{id} with an empty JSON body {}",
          "Validate the HTTP status code and response"
        ],
        "expectedResult": "HTTP 400 Bad Request is returned; response body indicates that at least one field must be provided for a partial update; the
  resource is not modified"
      },
      {
        "id": "ERR-007",
        "title": "DELETE /api/v1/test-suites/{id} with dependent test cases returns 409 if cascading delete is disabled",
        "preconditions": [
          "A valid Admin JWT is available",
          "A test suite with at least one associated test case exists",
          "Cascade delete is disabled in system configuration"
        ],
        "steps": [
          "Send DELETE /api/v1/test-suites/{suite_id} with a valid Admin JWT",
          "Validate the HTTP status code and response body"
        ],
        "expectedResult": "HTTP 409 Conflict is returned; response body indicates the suite cannot be deleted while dependent test cases exist; the suite
  and its test cases remain intact"
      }
    ],
    "rateLimitTests": [
      {
        "id": "RATE-001",
        "title": "Exceeding the request rate limit returns 429 with Retry-After header",
        "preconditions": [
          "A valid JWT is available",
          "The rate limit policy is known (e.g., 100 requests per minute per user)"
        ],
        "steps": [
          "Send GET /api/v1/test-cases in a loop exceeding the rate limit threshold within the rate window",
          "Record the response at the point where the limit is breached",
          "Inspect response headers"
        ],
        "expectedResult": "HTTP 429 Too Many Requests is returned; response includes a Retry-After header indicating when the client may retry; response
  body contains a rate limit error message; no 500 error occurs"
      },
      {
        "id": "RATE-002",
        "title": "Requests resume successfully after the rate limit window resets",
        "preconditions": [
          "A valid JWT is available",
          "The rate limit has just been exceeded (prior test or setup)"
        ],
        "steps": [
          "Confirm that a request returns HTTP 429",
          "Wait for the duration specified in the Retry-After header",
          "Send GET /api/v1/test-cases immediately after the window resets"
        ],
        "expectedResult": "HTTP 200 is returned after the rate limit window expires; the client is not permanently blocked; data is returned correctly"
      },
      {
        "id": "RATE-003",
        "title": "Rate limiting is applied per user and does not affect other users when one user exceeds the limit",
        "preconditions": [
          "Two distinct valid JWTs are available (User A and User B)",
          "Rate limit is per user"
        ],
        "steps": [
          "Exhaust the rate limit for User A by sending requests in a loop until 429 is received",
          "Send GET /api/v1/test-cases with User B's JWT",
          "Validate the response for User B"
        ],
        "expectedResult": "User A receives HTTP 429; User B's request returns HTTP 200 with valid data, confirming that rate limiting is scoped per user and
   not globally"
      }
    ],
    "schemaValidationTests": [
      {
        "id": "SCHEMA-001",
        "title": "POST /api/v1/test-cases rejects a request body with all required fields missing",
        "preconditions": [
          "A valid Admin JWT is available"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with an empty JSON body {}",
          "Validate the HTTP status code",
          "Validate that the error response lists all missing required fields"
        ],
        "expectedResult": "HTTP 400 Bad Request is returned; the error body enumerates all required fields that are missing (e.g., title, suiteId); no test
  case is created"
      },
      {
        "id": "SCHEMA-002",
        "title": "POST /api/v1/test-cases enforces maximum length on the title field",
        "preconditions": [
          "A valid Admin JWT is available",
          "Maximum allowed title length is known (e.g., 255 characters)"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with a title of exactly 255 characters — record success",
          "Send POST /api/v1/test-cases with a title of 256 characters",
          "Validate both responses"
        ],
        "expectedResult": "Request with 255-character title returns HTTP 201; request with 256-character title returns HTTP 400 with an error specifying the
   maximum length constraint on the title field"
      },
      {
        "id": "SCHEMA-003",
        "title": "POST /api/v1/test-cases rejects an empty string for the title field",
        "preconditions": [
          "A valid Admin JWT is available"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with title set to an empty string \"\"",
          "Validate the HTTP status code and error body"
        ],
        "expectedResult": "HTTP 400 Bad Request is returned; error body specifies that title cannot be empty or must meet a minimum length requirement; no
  test case is created"
      },
      {
        "id": "SCHEMA-004",
        "title": "POST /api/v1/test-cases rejects an invalid enum value for the priority field",
        "preconditions": [
          "A valid Admin JWT is available",
          "Priority field accepts only: 'low', 'medium', 'high', 'critical'"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with priority set to 'urgent'",
          "Validate the HTTP status code and error body"
        ],
        "expectedResult": "HTTP 400 Bad Request is returned; error body specifies that 'urgent' is not a valid value for priority and lists the accepted
  enum values"
      },
      {
        "id": "SCHEMA-005",
        "title": "POST /api/v1/test-cases ignores unknown fields and creates the resource using only defined schema fields",
        "preconditions": [
          "A valid Admin JWT is available"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with a valid body plus an additional unknown field 'hackerField': 'injected_value'",
          "Validate the HTTP status code",
          "Inspect the response body and subsequently GET the created resource"
        ],
        "expectedResult": "HTTP 201 Created is returned; the created resource does not include 'hackerField' in the response or in subsequent GET responses;
   the unknown field is silently ignored without causing a 400 or 500"
      },
      {
        "id": "SCHEMA-006",
        "title": "POST /api/v1/test-cases rejects a non-UUID format for the suiteId field",
        "preconditions": [
          "A valid Admin JWT is available",
          "suiteId must conform to UUID v4 format"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with suiteId set to 'not-a-uuid'",
          "Validate the HTTP status code and error body"
        ],
        "expectedResult": "HTTP 400 Bad Request is returned; error body specifies that suiteId must be a valid UUID; no test case is created"
      },
      {
        "id": "SCHEMA-007",
        "title": "POST /api/v1/test-cases enforces maximum item count for an array field (e.g., tags)",
        "preconditions": [
          "A valid Admin JWT is available",
          "Maximum allowed tags per test case is known (e.g., 10)"
        ],
        "steps": [
          "Send POST /api/v1/test-cases with a tags array containing 11 items",
          "Validate the HTTP status code and error body"
        ],
        "expectedResult": "HTTP 400 Bad Request is returned; error body specifies the maximum number of tags allowed; no test case is created"
      }
    ],
    "concurrencyTests": [
      {
        "id": "CONC-001",
        "title": "[Concurrency] Simultaneous POST requests with the same unique title in the same suite result in exactly one created resource and one 409",
        "preconditions": [
          "Two valid Admin JWTs are available (or the same JWT used from two clients)",
          "No test case with the target title exists in the target suite"
        ],
        "steps": [
          "Prepare two identical POST /api/v1/test-cases request bodies with the same title and suiteId",
          "Send both requests simultaneously from two concurrent clients",
          "Collect both HTTP responses",
          "Send GET /api/v1/test-cases?suiteId={suite_id}&title={title} to count resources created"
        ],
        "expectedResult": "Exactly one request returns HTTP 201 Created; the other returns HTTP 409 Conflict; only one test case with the given title exists
   in the suite; no duplicate resource is persisted"
      },
      {
        "id": "CONC-002",
        "title": "[Concurrency] Simultaneous PATCH requests targeting the same test case field serialize correctly without data loss or corruption",
        "preconditions": [
          "Two valid Admin or Manager JWTs are available",
          "An existing test case is available with a known 'status' value"
        ],
        "steps": [
          "Client A prepares PATCH /api/v1/test-cases/{id} with status: 'active'",
          "Client B prepares PATCH /api/v1/test-cases/{id} with status: 'archived'",
          "Send both PATCH requests simultaneously",
          "After both responses are received, send GET /api/v1/test-cases/{id}",
          "Record the final status value"
        ],
        "expectedResult": "Both PATCH requests return HTTP 200; the final GET returns exactly one of 'active' or 'archived' — the value from whichever write
   was last committed; the field is not null, undefined, or in a mixed/corrupt state"
      },
      {
        "id": "CONC-003",
        "title": "[Concurrency] Simultaneous DELETE and PATCH on the same resource results in one success and one 404, not a 500",
        "preconditions": [
          "A valid Admin JWT is available",
          "An existing test case ID is available"
        ],
        "steps": [
          "Client A sends DELETE /api/v1/test-cases/{id}",
          "Client B simultaneously sends PATCH /api/v1/test-cases/{id} with a valid body",
          "Collect both HTTP responses",
          "Send GET /api/v1/test-cases/{id} to confirm final state"
        ],
        "expectedResult": "One of the concurrent requests returns a success status (DELETE: 204, PATCH: 200); the other returns HTTP 404 Not Found; no HTTP
  500 error occurs; the resource is either deleted or updated in a consistent final state with no partial mutations persisted alongside a deleted record"
      },
      {
        "id": "CONC-004",
        "title": "[Concurrency] High-volume concurrent GETs on the same resource return consistent data without server errors",
        "preconditions": [
          "50 valid JWTs are available (or a single JWT reused across clients)",
          "An existing test case with known field values is available",
          "No writes are occurring during the test"
        ],
        "steps": [
          "Send 50 concurrent GET /api/v1/test-cases/{id} requests",
          "Collect all HTTP responses and response bodies",
          "Compare all response bodies to the known test case snapshot"
        ],
        "expectedResult": "All 50 requests return HTTP 200; every response body is identical and matches the known snapshot; no request returns 429, 500, or
   a partial/corrupt payload"
      }
    ]
  }

  ### REST API Module – Prompt Reflection

The REST API prompt was structured to enforce clear separation across authentication, CRUD, error handling, rate limiting, schema validation, and concurrency scenarios. The goal was to mirror real enterprise-grade API regression coverage rather than basic happy-path validation.

The generated output provided comprehensive coverage across authorization boundaries, idempotency, race conditions, and schema constraints. No major structural refinements were required, as the response aligned closely with the intended architecture-level test coverage.