"use client";

import { useState, useEffect } from "react";
import IconShare from "#src/icons/share.svg";

const iconShareSize = 16;

/**
 * @function ButtonShare
 * @param {Object} props
 * @param {ShareData} props.data
 * @returns {React.ReactNode}
 */
export default function ButtonShare({ data }) {
  /**
   * @type {ReturnType<typeof useState<boolean>>}
   */
  const [canShare, setCanShare] = useState();

  useEffect(() => {
    if ("share" in navigator) {
      setCanShare(true);
    }
  }, []);

  async function share() {
    try {
      await navigator.share(data);
    } catch (error) {}
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
