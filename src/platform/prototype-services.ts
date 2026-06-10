export type PrototypeProfile = {
  id: string;
  email: string | null;
  name: string;
  phone: string;
  homeCity?: string;
};

const unavailableMessage =
  'Account services are unavailable in this prototype. Supabase integration has not been implemented.';

export async function signInWithEmail(_email: string, _password: string): Promise<never> {
  throw new Error(unavailableMessage);
}

export async function signUpWithEmail(_email: string, _password: string): Promise<never> {
  throw new Error(unavailableMessage);
}

export async function signOutUser(): Promise<void> {
  return Promise.resolve();
}

export async function loadPrototypeProfile(_userId: string): Promise<null> {
  return Promise.resolve(null);
}

export async function savePrototypeProfile(_profile: PrototypeProfile): Promise<never> {
  throw new Error(unavailableMessage);
}
