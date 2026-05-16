import { PLATFORM_NAME } from "#src/lib/env";

export default function PageProfileStyle() {
  return (
    <>
      <h1>Style</h1>
      <p>
        Currently, <strong>{PLATFORM_NAME}</strong> does not have any style options. But additional themes will be avaialble soon.
      </p>
    </>
  );
}
