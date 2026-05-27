'use client';

import {
  Auth,
  UserCredential,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/**
 * Starts anonymous sign-in and returns Firebase's promise so callers can handle
 * success and failure honestly.
 */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  return signInAnonymously(authInstance);
}

/**
 * Starts email/password sign-up and returns Firebase's promise so UI state does
 * not pretend success before Firebase confirms it.
 */
export function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string
): Promise<UserCredential> {
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/**
 * Starts email/password sign-in and returns Firebase's promise so callers can
 * show real errors and stop loading states correctly.
 */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(authInstance, email, password);
}
