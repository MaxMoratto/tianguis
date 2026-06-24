"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, firebaseEnabled } from "./firebase";

function ensure() {
  if (!firebaseEnabled || !auth) {
    throw new Error(
      "Firebase no está configurado. Agrega tus llaves en .env.local para usar el login."
    );
  }
  return auth;
}

export async function registrar(nombre: string, email: string, pass: string) {
  const a = ensure();
  const cred = await createUserWithEmailAndPassword(a, email, pass);
  if (nombre) await updateProfile(cred.user, { displayName: nombre });
  return cred.user;
}

export async function entrar(email: string, pass: string) {
  const a = ensure();
  const cred = await signInWithEmailAndPassword(a, email, pass);
  return cred.user;
}

export async function entrarConGoogle() {
  const a = ensure();
  const cred = await signInWithPopup(a, new GoogleAuthProvider());
  return cred.user;
}

export async function salir() {
  if (firebaseEnabled && auth) await signOut(auth);
}
