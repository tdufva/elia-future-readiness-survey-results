"use client";

import { FormEvent, useState } from "react";

export default function DataUnlock({ error, loading, onUnlock }: { error: string; loading: boolean; onUnlock: (password: string) => Promise<void> }) {
  const [password, setPassword] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onUnlock(password);
  };

  return <section className="data-unlock" aria-labelledby="data-unlock-title">
    <div><p className="eyebrow">Protected respondent data</p><h2 id="data-unlock-title">Enter the site password.</h2><p>Respondent profiles and linked answers are encrypted. Unlock them to continue.</p></div>
    <form onSubmit={submit}><label htmlFor="data-password">Password</label><div><input id="data-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="submit" disabled={loading}>{loading ? "Unlocking…" : "Unlock"}</button></div>{error && <p className="form-error" role="alert">{error}</p>}</form>
  </section>;
}
