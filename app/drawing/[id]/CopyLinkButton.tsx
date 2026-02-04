'use client';

import { track } from '@vercel/analytics';

export default function CopyLinkButton() {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    
    // Track link copy from public drawing page
    track('Public Drawing Link Copied', {
      url: window.location.href,
    });
  };

  return (
    <button
      onClick={copyLink}
      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700 text-sm"
    >
      📋 Copy Link
    </button>
  );
}
