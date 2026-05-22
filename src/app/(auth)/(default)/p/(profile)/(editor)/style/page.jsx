"use client";

import { useEffect } from "react";
import { alertErrorApp } from "#src/lib/alert";
import { PLATFORM_NAME } from "#src/lib/env";
import { requestProfileThemes } from "#src/lib/request";

async function getProfileThemes() {
  const res = await requestProfileThemes();

  if (!res) {
    return;
  }

  if (!res.ok) {
    alertErrorApp();
    return;
  }

  console.log(await res.json())
}

export default function PageProfileStyle() {

  useEffect(() => {
    getProfileThemes()
  }, []);

  return (
    <>
      <h1>Profile Style</h1>
      <p>
        Currently, <strong>{PLATFORM_NAME}</strong> does not have any style options. But additional themes will be avaialble soon.
      </p>
    </>
  );
}
