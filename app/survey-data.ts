"use client";

import { useCallback, useEffect, useState } from "react";

export type RespondentAnswer = {
  key: string;
  shortLabel: string;
  question: string;
  text: string;
  voiceEntryId: string;
  themes: string[];
};

export type Respondent = {
  id: string;
  label: string;
  country: string;
  age: string;
  roles: string[];
  answers: RespondentAnswer[];
};

export type SurveyData = {
  version: number;
  respondentCount: number;
  answerCount: number;
  respondents: Respondent[];
  voiceIndex: Record<string, string>;
};

type AccessConfig = {
  salt: string;
  iterations: number;
  keyStorage: string;
};

type EncryptedPayload = {
  iv: string;
  ciphertext: string;
  tag: string;
};

const fallbackKeyStorage = "elia-survey-access-key-v1";

function siteBasePath() {
  return window.location.pathname.startsWith("/elia-future-readiness-survey-results")
    ? "/elia-future-readiness-survey-results"
    : "";
}

function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function encodeBase64(value: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(value)));
}

async function readFiles() {
  const base = siteBasePath();
  const [configResponse, payloadResponse] = await Promise.all([
    fetch(`${base}/access-config.json`, { cache: "no-store" }),
    fetch(`${base}/data/respondents.enc.json`, { cache: "no-store" }),
  ]);
  if (!configResponse.ok || !payloadResponse.ok) throw new Error("The protected survey data could not be loaded.");
  return {
    config: await configResponse.json() as AccessConfig,
    payload: await payloadResponse.json() as EncryptedPayload,
  };
}

async function deriveKey(password: string, config: AccessConfig) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: decodeBase64(config.salt), iterations: config.iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"],
  );
}

async function decryptPayload(key: CryptoKey, payload: EncryptedPayload) {
  const ciphertext = decodeBase64(payload.ciphertext);
  const tag = decodeBase64(payload.tag);
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext);
  combined.set(tag, ciphertext.length);
  const cleartext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: decodeBase64(payload.iv), tagLength: 128 },
    key,
    combined,
  );
  return JSON.parse(new TextDecoder().decode(cleartext)) as SurveyData;
}

async function keyFromSession(config: AccessConfig) {
  const encoded = sessionStorage.getItem(config.keyStorage || fallbackKeyStorage);
  if (!encoded) return null;
  return crypto.subtle.importKey("raw", decodeBase64(encoded), { name: "AES-GCM" }, true, ["decrypt"]);
}

async function loadSurveyData(password?: string) {
  const { config, payload } = await readFiles();
  const key = password ? await deriveKey(password, config) : await keyFromSession(config);
  if (!key) return null;
  try {
    const data = await decryptPayload(key, payload);
    if (password) {
      const rawKey = await crypto.subtle.exportKey("raw", key);
      sessionStorage.setItem(config.keyStorage || fallbackKeyStorage, encodeBase64(rawKey));
    }
    return data;
  } catch {
    sessionStorage.removeItem(config.keyStorage || fallbackKeyStorage);
    throw new Error("That password did not unlock the survey data.");
  }
}

export function useSurveyData() {
  const [data, setData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSurveyData()
      .then((result) => {
        if (result) setData(result);
        else setLocked(true);
      })
      .catch((cause: Error) => {
        setLocked(true);
        setError(cause.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const unlock = useCallback(async (password: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await loadSurveyData(password);
      if (!result) throw new Error("Enter the site password to continue.");
      setData(result);
      setLocked(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The survey data could not be unlocked.");
      setLocked(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, locked, error, unlock };
}
