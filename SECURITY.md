# Security Policy

## API Keys
The Google API key used in this project is intended to be public. In a frontend-only application like this, the key must be included in the client-side code to allow the browser to communicate with Firebase services (Authentication and Firestore).

To prevent abuse, the following security measures should be (and have been) implemented:

1.  **Domain Restriction:** The API key is restricted to only work on authorized domains (e.g., `etcharion.github.io` and `localhost`).
2.  **Service Restriction:** The API key is restricted to only allow access to the specific APIs needed for this project:
    *   `Identity Toolkit API`
    *   `Cloud Firestore API`
3.  **Firestore Security Rules:** Access to the database is controlled by Firebase Security Rules, which ensure that users can only read or write data according to the application's logic, regardless of having the API key.

## Reporting a Vulnerability
If you discover any security-related issues, please open an issue in this repository.
