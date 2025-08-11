// Google OAuth integration
declare global {
  interface Window {
    google: any;
    googleSignInCallback: (response: any) => void;
  }
}

interface GoogleUser {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  sub: string;
}

interface GoogleAuthResponse {
  credential: string;
}

class GoogleAuthService {
  private clientId = '752086458650-h6kga1ium8n5l8baaadjkfnmti2tsjb3.apps.googleusercontent.com';
  private isInitialized = false;

  // Check if we're in a WebContainer environment where Google OAuth won't work
  private isWebContainer(): boolean {
    return window.location.hostname.includes('webcontainer-api.io') || 
           window.location.hostname.includes('local-credentialless');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Skip initialization in WebContainer environment (but allow localhost)
    if (this.isWebContainer()) {
      console.log('Google OAuth disabled in WebContainer environment');
      this.isInitialized = true;
      return;
    }

    return new Promise((resolve, reject) => {
      const checkGoogleLoaded = () => {
        if (window.google?.accounts?.id) {
          try {
            window.google.accounts.id.initialize({
              client_id: this.clientId,
              callback: this.handleCredentialResponse.bind(this),
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            this.isInitialized = true;
            resolve();
          } catch (error) {
            console.error('Failed to initialize Google Sign-In:', error);
            reject(error);
          }
        } else {
          setTimeout(checkGoogleLoaded, 100);
        }
      };
      checkGoogleLoaded();
    });
  }

  private handleCredentialResponse(response: GoogleAuthResponse): void {
    if (window.googleSignInCallback) {
      window.googleSignInCallback(response);
    }
  }

  private parseJWT(token: string): GoogleUser | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      return null;
    }
  }

  async signIn(): Promise<{ user: GoogleUser | null; error: string | null }> {
    // Return error immediately in WebContainer environment (but allow localhost)
    if (this.isWebContainer()) {
      return { 
        user: null, 
        error: 'Google Sign-In is not available in this environment. Please use email/password authentication.' 
      };
    }

    try {
      await this.initialize();

      return new Promise((resolve) => {
        // Set up callback for credential response
        window.googleSignInCallback = (response: GoogleAuthResponse) => {
          const user = this.parseJWT(response.credential);
          if (user) {
            resolve({ user, error: null });
          } else {
            resolve({ user: null, error: 'Failed to parse Google user data' });
          }
        };

        // Trigger Google Sign-In popup
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to manual sign-in
            this.showManualSignIn().then((result) => {
              resolve(result);
            });
          }
        });
      });
    } catch (error) {
      return { user: null, error: 'Failed to initialize Google Sign-In' };
    }
  }

  private showManualSignIn(): Promise<{ user: GoogleUser | null; error: string | null }> {
    return new Promise((resolve) => {
      // Create a manual sign-in button
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      
      const modal = document.createElement('div');
      modal.className = 'bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4';
      modal.innerHTML = `
        <div class="text-center">
          <img src="https://www.google.com/favicon.ico" alt="Google" class="w-12 h-12 mx-auto mb-4">
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Sign in with Google</h2>
          <p class="text-gray-600 mb-6">Choose your Google account to continue</p>
          <div id="google-signin-button" class="mb-4"></div>
          <button class="cancel-signin w-full text-gray-600 hover:text-gray-900 transition-colors">
            Cancel
          </button>
        </div>
      `;
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Render Google Sign-In button
      if (window.google?.accounts?.id) {
        window.google.accounts.id.renderButton(
          modal.querySelector('#google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: 300,
            text: 'signin_with',
            shape: 'rectangular',
          }
        );
      }

      // Handle cancel
      const cancelButton = modal.querySelector('.cancel-signin');
      cancelButton?.addEventListener('click', () => {
        document.body.removeChild(overlay);
        resolve({ user: null, error: 'Google sign-in cancelled' });
      });

      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
          resolve({ user: null, error: 'Google sign-in cancelled' });
        }
      });

      // Set up success callback
      const originalCallback = window.googleSignInCallback;
      window.googleSignInCallback = (response: GoogleAuthResponse) => {
        document.body.removeChild(overlay);
        const user = this.parseJWT(response.credential);
        if (user) {
          resolve({ user, error: null });
        } else {
          resolve({ user: null, error: 'Failed to parse Google user data' });
        }
        window.googleSignInCallback = originalCallback;
      };
    });
  }
}

export const googleAuth = new GoogleAuthService();