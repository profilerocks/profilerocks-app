"use client";

import type React from "react";
import { useState, useEffect } from "react";
import IconShare from "#src/icons/share.svg";

const iconShareSize = 16;

interface ButtonShareProps {
  data: ShareData;
}

export default function ButtonShare({ data }: ButtonShareProps): React.ReactNode {
  const [canShare, setCanShare] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if ("share" in navigator) {
      setCanShare(true);
    }
  }, []);

  async function share(): Promise<void> {
    try {
      await navigator.share(data);
    } catch {}
  }

  return canShare === undefined ? (
    <button disabled={true} title="Loading">
      <IconShare width={iconShareSize} height={iconShareSize} />
    </button>
  ) : canShare ? (
    <button type="button" onClick={share} title="Share">
      <IconShare width={iconShareSize} height={iconShareSize} />
    </button>
  ) : (
    <button disabled={true} title="Your browser doesn't support the Share API; try copying the URL.">
      <IconShare width={iconShareSize} height={iconShareSize} />
    </button>
  );
}
