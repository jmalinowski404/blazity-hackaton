"use client";

export function NewCheckButton() {
  return (
    <button className="btn btn-primary" onClick={() => window.location.assign("/")}>
      New check
    </button>
  );
}
