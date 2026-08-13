"use client";

const keyStorage = "elia-survey-access-key-v1";

export default function LockButton() {
  const lock = () => {
    sessionStorage.removeItem(keyStorage);
    window.location.reload();
  };

  return <button className="lock-button" type="button" onClick={lock} aria-label="Lock this survey site">Lock site</button>;
}
