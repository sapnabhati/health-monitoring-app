# Google Sign-In Setup Guide

This guide will help you set up Google OAuth authentication for the AuraHealth app.

## Steps to Enable Google Sign-In

### 1. Create a Google Cloud Project
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Click on the project dropdown and select "New Project"
- Enter a project name (e.g., "AuraHealth")
- Click "Create"

### 2. Enable Google+ API
- In the Cloud Console, go to "APIs & Services" > "Library"
- Search for "Google+ API" or "Google Identity"
- Click on "Google+ API"
- Click the "Enable" button

### 3. Create OAuth 2.0 Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth client ID"
- Select "Web application"
- Under "Authorized JavaScript origins", add:
  - `http://localhost:3000` (for development)
  - `http://localhost:5173` (for Vite development)
  - `https://yourdomain.com` (for production)
- Under "Authorized redirect URIs", add:
  - `http://localhost:3000/` (for development)
  - `http://localhost:5173/` (for Vite development)
  - `https://yourdomain.com/` (for production)
- Click "Create"

### 4. Copy Your Client ID
- Copy the "Client ID" from the credentials page

### 5. Configure the App
- Open the `.env.local` file in the root of your project
- Replace the placeholder `VITE_GOOGLE_CLIENT_ID` with your actual Client ID:
  ```
  VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
  ```

### 6. Restart the Development Server
- Stop your running Vite dev server
- Run `npm run dev` again

## Features Added

### Sign-In Page
- **Regular Login**: Email and password authentication
- **Google Sign-In**: Click "Continue with Google" to authenticate using your Google account
- **Google Sign-Up**: Create a new account using Google

### How It Works
1. Users can click the Google Sign-In button on the login or signup page
2. They'll be redirected to Google's authentication flow
3. After successful authentication, they'll be logged into the app
4. Their Google ID token is stored securely in localStorage

## Security Notes

- The Google ID token is stored in `localStorage` as `googleToken`
- For production, implement server-side token verification
- Never expose your Client ID in version control
- The `.env.local` file is already in `.gitignore` for security

## Backend Integration (Optional)

To verify Google tokens on your backend:

```python
# In your FastAPI backend (main.py)
from google.auth.transport import requests
from google.oauth2 import id_token

def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        return idinfo
    except ValueError:
        return None
```

## Troubleshooting

### Google Sign-In Button Not Appearing
- Check if `VITE_GOOGLE_CLIENT_ID` is set in `.env.local`
- Ensure the Google OAuth script is loaded in `index.html`
- Check browser console for errors

### "Client ID not configured" Warning
- This warning appears when `VITE_GOOGLE_CLIENT_ID` is not set
- Add the environment variable to `.env.local`

### Sign-In Fails
- Verify your Client ID is correct
- Ensure `http://localhost:5173` is in your authorized JavaScript origins
- Check browser console for specific error messages

## Demo Account

For testing without Google account:
- Email: `demo@aurahealth.com`
- Password: `demo123`

## Environment Variables

The app uses the following environment variable (stored in `.env.local`):

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | `437840...apps.googleusercontent.com` |

## Additional Resources

- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)
