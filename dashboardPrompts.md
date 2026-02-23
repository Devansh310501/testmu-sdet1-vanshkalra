# Task 2 – Prompt Engineering

## Dashboard Module – Prompt V1

You are a senior QA automation architect designing regression coverage for a SaaS test management platform.

Module: Dashboard

Context:
- Users authenticate via JWT.
- Dashboard contains multiple widgets displaying analytics and activity data.
- Widgets fetch data from REST APIs.
- Role-based access control determines widget visibility.
- Filters and sorting are available.
- Application supports responsive layouts.

Your task:
Generate structured regression test cases for the Dashboard module.

Requirements:
1. Separate UI-level and API-level tests.
2. Cover:
   - Widget rendering and loading states
   - Data accuracy validation
   - Filter and sorting behavior
   - Permission-based visibility
   - Responsive layout behavior
   - Partial API failure handling
   - Data refresh behavior
3. Include at least 3 concurrency or race-condition scenarios.
4. Avoid infrastructure-only checks.
5. Avoid redundant scenarios.
6. Keep automation feasibility in mind.

Return JSON only in this structure:

{
  "module": "Dashboard",
  "uiTests": [],
  "apiTests": []
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
    "module": "Dashboard",                                                                                                                                  
    "uiTests": [                                                                                                                                            
      {                                                                                                                                                   
        "id": "DASH-UI-001",                                                                                                                                
        "title": "Widgets display skeleton/loading state while fetching data",                                                                              
        "preconditions": [
          "User is authenticated with a valid JWT",                                                                                                         
          "Network speed is throttled to simulate slow API response (e.g., 3G)"                                                                             
        ],                                                                                                                                                  
        "steps": [                                                                                                                                          
          "Navigate to the Dashboard page",                                                                                                                 
          "Immediately capture the rendered state of all widgets before data loads"                                                                         
        ],                                                                                                                                                  
        "expectedResult": "Each widget displays a skeleton loader or spinner; no raw data or empty containers are shown during the loading phase"
      },
      {
        "id": "DASH-UI-002",
        "title": "All widgets render correct data after successful API responses",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "API endpoints return known fixture data for widget content"
        ],
        "steps": [
          "Navigate to the Dashboard page",
          "Wait for all widgets to finish loading",
          "Compare each widget's displayed values against the expected fixture data"
        ],
        "expectedResult": "All widget values (counts, percentages, lists, charts) match the corresponding API fixture data exactly"
      },
      {
        "id": "DASH-UI-003",
        "title": "Widget displays empty state when API returns an empty dataset",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "One or more widget APIs are mocked to return an empty array or zero count"
        ],
        "steps": [
          "Navigate to the Dashboard page",
          "Wait for all widgets to finish loading",
          "Inspect the widget(s) whose API returned empty data"
        ],
        "expectedResult": "Affected widget(s) display a meaningful empty-state message or illustration; no broken layout, null values, or JavaScript errors
  appear"
      },
      {
        "id": "DASH-UI-004",
        "title": "Applying a date range filter updates all relevant widgets",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "Dashboard is fully loaded with default data"
        ],
        "steps": [
          "Open the date range filter control",
          "Select a custom date range (e.g., last 7 days)",
          "Confirm or apply the filter",
          "Wait for widgets to reload",
          "Compare widget data against the expected API response for that date range"
        ],
        "expectedResult": "All data-driven widgets re-fetch and display data scoped to the selected date range; filter chip or label reflects the active
  selection"
      },
      {
        "id": "DASH-UI-005",
        "title": "Multiple filters applied simultaneously produce correctly combined results",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "Dashboard is fully loaded"
        ],
        "steps": [
          "Apply a date range filter (e.g., last 30 days)",
          "Apply a status filter (e.g., 'Failed' tests only)",
          "Apply a project filter (e.g., a specific project)",
          "Wait for widgets to reload",
          "Verify widget data against expected results for all three filters combined"
        ],
        "expectedResult": "Widgets display data that satisfies all three filter conditions simultaneously; no filter overwrites another"
      },
      {
        "id": "DASH-UI-006",
        "title": "Sorting a widget table column toggles between ascending and descending order",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "A widget with a sortable table or list is visible on the Dashboard"
        ],
        "steps": [
          "Click a sortable column header once",
          "Record the order of displayed rows",
          "Click the same column header a second time",
          "Record the order again"
        ],
        "expectedResult": "First click sorts ascending (lowest to highest or A–Z); second click sorts descending; a sort indicator icon reflects the active
  sort direction"
      },
      {
        "id": "DASH-UI-007",
        "title": "Admin role user sees all dashboard widgets including restricted ones",
        "preconditions": [
          "A user with Admin role is authenticated with a valid JWT",
          "At least one widget is designated as visible only to Admin or Manager roles"
        ],
        "steps": [
          "Navigate to the Dashboard page",
          "Wait for all widgets to load",
          "Record all widget titles visible on the page"
        ],
        "expectedResult": "All widgets including admin-only and manager-only widgets are rendered and visible"
      },
      {
        "id": "DASH-UI-008",
        "title": "Viewer role user does not see widgets restricted to higher roles",
        "preconditions": [
          "A user with Viewer role is authenticated with a valid JWT",
          "At least one widget is configured to be hidden from Viewer role"
        ],
        "steps": [
          "Navigate to the Dashboard page",
          "Wait for all widgets to load",
          "Inspect the DOM and visual layout for restricted widget titles or containers"
        ],
        "expectedResult": "Restricted widgets are absent from both the DOM and the visual layout; no placeholder or locked widget UI is shown that reveals
  restricted content"
      },
      {
        "id": "DASH-UI-009",
        "title": "Dashboard layout adapts correctly on a mobile viewport (375px width)",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "Browser or device viewport is set to 375px width"
        ],
        "steps": [
          "Navigate to the Dashboard page at 375px viewport width",
          "Wait for all widgets to load",
          "Scroll through the entire dashboard",
          "Check for horizontal overflow, overlapping elements, or clipped content"
        ],
        "expectedResult": "Widgets stack vertically in a single column; all widget content is legible without horizontal scrolling; no UI elements overflow
  or overlap"
      },
      {
        "id": "DASH-UI-010",
        "title": "Dashboard layout adapts correctly on a tablet viewport (768px width)",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "Browser or device viewport is set to 768px width"
        ],
        "steps": [
          "Navigate to the Dashboard page at 768px viewport width",
          "Wait for all widgets to load",
          "Verify widget grid structure"
        ],
        "expectedResult": "Widgets render in a two-column or tablet-optimized grid as defined by breakpoint rules; no content is clipped, overlapping, or
  inaccessible"
      },
      {
        "id": "DASH-UI-011",
        "title": "Partial API failure shows error state on failed widget while others remain functional",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "One specific widget API endpoint is mocked to return HTTP 500"
        ],
        "steps": [
          "Navigate to the Dashboard page",
          "Wait for all widgets to finish their loading attempts",
          "Inspect the widget whose API returned 500",
          "Inspect all other widgets"
        ],
        "expectedResult": "The failed widget displays an error message or retry option; all other widgets load and display their data normally; the page
  does not crash"
      },
      {
        "id": "DASH-UI-012",
        "title": "Manual refresh button re-fetches widget data and reflects updated values",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "Dashboard is fully loaded with initial data"
        ],
        "steps": [
          "Record current values shown in a target widget",
          "Update the mocked API response for that widget to return different data",
          "Click the manual refresh button",
          "Wait for the widget to reload"
        ],
        "expectedResult": "The widget re-fetches data and displays the updated values from the new API response; a brief loading state is shown during
  re-fetch"
      },
      {
        "id": "DASH-UI-013",
        "title": "Auto-refresh updates widget data after the configured polling interval",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "Dashboard auto-refresh is configured (e.g., every 30 seconds)",
          "Initial data is loaded"
        ],
        "steps": [
          "Record the current values in a target widget",
          "Update the mocked API to return new data",
          "Wait for the polling interval to elapse without any user interaction",
          "Observe the widget"
        ],
        "expectedResult": "After the polling interval, the widget silently re-fetches and updates its content to reflect the new API data without a full
  page reload"
      },
      {
        "id": "DASH-UI-014",
        "title": "[Concurrency] Rapid successive filter changes resolve to the last selected filter",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "Dashboard is fully loaded",
          "Network responses are delayed by 500ms using request interception"
        ],
        "steps": [
          "Apply filter option A",
          "Immediately (within 100ms) apply filter option B",
          "Immediately (within 100ms) apply filter option C",
          "Wait for all in-flight requests to settle",
          "Inspect the widget data and the active filter label"
        ],
        "expectedResult": "Only the data corresponding to filter option C (the last applied) is displayed; earlier in-flight responses for A and B are
  discarded and do not overwrite the final result; no stale data flickers are visible"
      },
      {
        "id": "DASH-UI-015",
        "title": "[Concurrency] Dashboard state remains consistent when opened in two browser tabs simultaneously",
        "preconditions": [
          "User is authenticated with a valid JWT",
          "Two browser tabs are opened to the Dashboard"
        ],
        "steps": [
          "In Tab 1, apply a date range filter",
          "In Tab 2, apply a different status filter simultaneously",
          "Observe both tabs after their respective requests complete"
        ],
        "expectedResult": "Each tab independently maintains its own filter state; actions in one tab do not affect or reset the filter or data in the other
  tab"
      },
      {
        "id": "DASH-UI-016",
        "title": "[Concurrency] JWT expiry mid-load causes graceful session expiry, not a broken partial dashboard",
        "preconditions": [
          "User is authenticated with a JWT set to expire in 2 seconds",
          "Widget API responses are delayed by 3 seconds"
        ],
        "steps": [
          "Navigate to the Dashboard page",
          "Allow the JWT to expire before widget API responses return",
          "Observe widget states and any redirect or notification behavior"
        ],
        "expectedResult": "All in-flight widget requests that fail due to expired JWT are handled gracefully; the user is redirected to the login page or
  shown a session-expired notification; no widget displays partial or corrupt data"
      }
    ],
    "apiTests": [
      {
        "id": "DASH-API-001",
        "title": "GET /dashboard/widgets returns HTTP 200 with all widget payloads for authenticated admin",
        "preconditions": [
          "A valid JWT for an Admin role user is available",
          "All widget backend services are healthy"
        ],
        "steps": [
          "Send GET /dashboard/widgets with Authorization: Bearer <admin_jwt>",
          "Validate the HTTP status code",
          "Validate the response body schema for each widget object"
        ],
        "expectedResult": "HTTP 200 is returned; response body is a JSON array containing all expected widget objects, each with required fields (id, type,
  title, data)"
      },
      {
        "id": "DASH-API-002",
        "title": "GET /dashboard/widgets returns HTTP 401 when JWT is expired or missing",
        "preconditions": [
          "An expired JWT or no token is used for the request"
        ],
        "steps": [
          "Send GET /dashboard/widgets with an expired JWT in the Authorization header",
          "Send GET /dashboard/widgets with no Authorization header",
          "Validate both responses"
        ],
        "expectedResult": "Both requests return HTTP 401 Unauthorized; response body contains an appropriate error code and message; no widget data is
  leaked"
      },
      {
        "id": "DASH-API-003",
        "title": "GET /dashboard/widgets filters data correctly by date range query parameters",
        "preconditions": [
          "A valid Admin JWT is available",
          "Known seed data exists for specific date ranges"
        ],
        "steps": [
          "Send GET /dashboard/widgets?from=2025-01-01&to=2025-01-31 with a valid JWT",
          "Compare each widget's returned data against expected values for January 2025",
          "Send the same request with a different date range and verify the data changes accordingly"
        ],
        "expectedResult": "Widget data in the response is scoped exclusively to the specified date range; records outside the range are absent"
      },
      {
        "id": "DASH-API-004",
        "title": "Widget list endpoint returns correctly sorted results when sort parameters are provided",
        "preconditions": [
          "A valid JWT is available",
          "A widget endpoint supports sort_by and order query parameters"
        ],
        "steps": [
          "Send GET /dashboard/widgets/{id}/data?sort_by=created_at&order=asc",
          "Verify the order of items in the response array",
          "Send GET /dashboard/widgets/{id}/data?sort_by=created_at&order=desc",
          "Verify the reversed order"
        ],
        "expectedResult": "Ascending request returns items ordered from oldest to newest; descending request returns items from newest to oldest; sort is
  applied server-side before pagination"
      },
      {
        "id": "DASH-API-005",
        "title": "Viewer role JWT receives only permitted widgets from GET /dashboard/widgets",
        "preconditions": [
          "A valid JWT for a Viewer role user is available",
          "The permission matrix defines which widgets are accessible to Viewer role"
        ],
        "steps": [
          "Send GET /dashboard/widgets with Authorization: Bearer <viewer_jwt>",
          "Record the widget IDs returned",
          "Compare against the expected permitted widget IDs for Viewer role"
        ],
        "expectedResult": "HTTP 200 is returned; only widgets permitted for Viewer role are present in the response; admin-only or manager-only widget IDs
  are absent"
      },
      {
        "id": "DASH-API-006",
        "title": "GET /dashboard/widgets returns HTTP 403 when Viewer role requests an admin-only widget by ID",
        "preconditions": [
          "A valid JWT for a Viewer role user is available",
          "The ID of an admin-only widget is known"
        ],
        "steps": [
          "Send GET /dashboard/widgets/{admin_only_widget_id} with Authorization: Bearer <viewer_jwt>"
        ],
        "expectedResult": "HTTP 403 Forbidden is returned; response body contains an appropriate permission error message; no widget data is returned"
      },
      {
        "id": "DASH-API-007",
        "title": "Dashboard aggregation endpoint returns partial results when one downstream widget service fails",
        "preconditions": [
          "A valid JWT is available",
          "One widget's upstream service is mocked to return HTTP 500 or timeout"
        ],
        "steps": [
          "Send GET /dashboard/widgets with a valid JWT while one widget service is failing",
          "Inspect the response body and HTTP status code"
        ],
        "expectedResult": "HTTP 207 Multi-Status or HTTP 200 is returned with partial data; the failed widget entry contains an error flag or null data
  field; all other widget entries contain valid data"
      },
      {
        "id": "DASH-API-008",
        "title": "Widget data endpoint returns HTTP 400 for invalid or out-of-range filter parameter values",
        "preconditions": [
          "A valid JWT is available"
        ],
        "steps": [
          "Send GET /dashboard/widgets?from=not-a-date&to=2025-01-31 with a valid JWT",
          "Send GET /dashboard/widgets?from=2025-12-01&to=2025-01-01 (end before start) with a valid JWT"
        ],
        "expectedResult": "Both requests return HTTP 400 Bad Request; response body specifies which parameter is invalid; no data is returned"
      },
      {
        "id": "DASH-API-009",
        "title": "POST /dashboard/widgets/refresh triggers a data re-fetch and returns updated data",
        "preconditions": [
          "A valid JWT is available",
          "Initial data is known; underlying data source has been updated since initial load"
        ],
        "steps": [
          "Send GET /dashboard/widgets to record baseline data",
          "Update the underlying data source",
          "Send POST /dashboard/widgets/refresh with a valid JWT",
          "Send GET /dashboard/widgets again and compare with baseline"
        ],
        "expectedResult": "HTTP 200 is returned from the refresh endpoint; subsequent GET returns the updated data, not the cached baseline"
      },
      {
        "id": "DASH-API-010",
        "title": "[Concurrency] Simultaneous GET /dashboard/widgets requests from the same user return consistent data",
        "preconditions": [
          "A valid JWT for a single user is available",
          "Backend data is static during the test"
        ],
        "steps": [
          "Send 10 concurrent GET /dashboard/widgets requests using the same JWT",
          "Collect all responses",
          "Compare the data payload across all responses"
        ],
        "expectedResult": "All 10 responses return HTTP 200; widget data is identical across all responses; no race condition causes partial, corrupt, or
  mismatched data"
      },
      {
        "id": "DASH-API-011",
        "title": "[Concurrency] Concurrent refresh and read requests do not return stale or corrupt data",
        "preconditions": [
          "A valid JWT is available",
          "Dashboard data source is updated just before the test"
        ],
        "steps": [
          "Send POST /dashboard/widgets/refresh and GET /dashboard/widgets simultaneously",
          "Record the data returned by the GET request",
          "After the refresh completes, send another GET /dashboard/widgets",
          "Compare both GET responses"
        ],
        "expectedResult": "The first GET returns either the pre-refresh data or the post-refresh data, never a corrupt mid-write state; the second GET
  consistently returns post-refresh data; no HTTP 5xx errors occur"
      },
      {
        "id": "DASH-API-012",
        "title": "[Concurrency] Concurrent filter requests with conflicting parameters from the same session resolve independently",
        "preconditions": [
          "A valid JWT is available",
          "Widget API supports per-request stateless filtering via query parameters"
        ],
        "steps": [
          "Send GET /dashboard/widgets?from=2025-01-01&to=2025-01-31 and GET /dashboard/widgets?from=2025-06-01&to=2025-06-30 simultaneously using the same
  JWT",
          "Record both responses and match each to its request"
        ],
        "expectedResult": "Each response contains data scoped to its own requested date range; neither response contains data from the other request's
  range; request-response pairing is correct"
      },
      {
        "id": "DASH-API-013",
        "title": "Widget data endpoint supports pagination and returns correct page boundaries",
        "preconditions": [
          "A valid JWT is available",
          "A widget endpoint returns more than one page of data (e.g., more than 20 records)"
        ],
        "steps": [
          "Send GET /dashboard/widgets/{id}/data?page=1&limit=20",
          "Record the returned items and total count",
          "Send GET /dashboard/widgets/{id}/data?page=2&limit=20",
          "Verify no overlap between page 1 and page 2 items"
        ],
        "expectedResult": "Page 1 returns the first 20 items; page 2 returns the next set of items with no duplicates; total count field is consistent
  across both responses"
      }
    ]
  }

  ### Dashboard Module – Prompt Reflection

The initial prompt was structured to enforce separation between UI-level and API-level tests from the start, based on learnings from the Login module. Emphasis was placed on concurrency, partial failure handling, and permission-based visibility to reflect real-world SaaS dashboard complexity.

The output successfully covered loading states, data correctness validation, responsive behavior, and stateless API filtering. No further structural refinement was required as the separation and coverage depth were appropriate in the first iteration.