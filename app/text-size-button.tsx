"use client";

import { useEffect, useSyncExternalStore } from "react";

const textSizeStorage = "elia-survey-text-size-v1";
const textSizeEvent = "elia-survey-text-size-change";

function applyTextSize(large: boolean) {
  if (large) document.documentElement.dataset.textSize = "large";
  else delete document.documentElement.dataset.textSize;
}

export default function TextSizeButton() {
  const large = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(textSizeEvent, onStoreChange);
      return () => window.removeEventListener(textSizeEvent, onStoreChange);
    },
    () => localStorage.getItem(textSizeStorage) === "large",
    () => false,
  );

  useEffect(() => {
    applyTextSize(large);
  }, [large]);

  const toggle = () => {
    const next = !large;
    applyTextSize(next);
    localStorage.setItem(textSizeStorage, next ? "large" : "standard");
    window.dispatchEvent(new Event(textSizeEvent));
  };

  return <button
    className="text-size-button"
    type="button"
    aria-pressed={large}
    aria-label={large ? "Use standard text size" : "Use larger text size"}
    title={large ? "Use standard text size" : "Use larger text size"}
    onClick={toggle}
  >{large ? "A−" : "A+"}</button>;
}
