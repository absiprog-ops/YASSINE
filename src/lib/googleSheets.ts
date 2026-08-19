import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App & Auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initGoogleAuth = (
  onSuccess: (user: User, token: string) => void,
  onFailure: () => void
) => {
  return onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      if (cachedAccessToken) {
        onSuccess(currentUser, cachedAccessToken);
      } else if (!isSigningIn) {
        onFailure();
      }
    } else {
      cachedAccessToken = null;
      onFailure();
    }
  });
};

export const signInWithGoogle = async () => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('لم نتمكن من الحصول على تصريح الوصول لخدمات جوجل (Access Token)');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, token: cachedAccessToken };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getCachedToken = () => cachedAccessToken;

/**
 * Creates a Google Spreadsheet on the logged-in user's Google Drive and populates it with headers and rows.
 */
export async function createGoogleSpreadsheet(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  token: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // Step 1: Create Spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`فشل إنشاء جدول Google Sheets: ${errText}`);
  }

  const spreadsheetData = await createRes.json();
  const spreadsheetId = spreadsheetData.spreadsheetId;
  const spreadsheetUrl = spreadsheetData.spreadsheetUrl;

  // Step 2: Populate Data with values.update
  const values = [headers, ...rows];
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: 'A1',
        majorDimension: 'ROWS',
        values,
      }),
    }
  );

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`فشل كتابة البيانات في جدول Google Sheets: ${errText}`);
  }

  return { spreadsheetId, spreadsheetUrl };
}
