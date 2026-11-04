import OauthGoogle from "#src/ui/button/oauth/google";
import FormUserEmailEnter from "#src/ui/form/email/enter";

export default function PageUserEnter() {
  return (
    <>
      <h1 className="mbe-5 text-3xl">Log in or register</h1>
      <FormUserEmailEnter />
      <p className="my-5 flex items-center gap-4 text-sm text-zinc-300 before:h-px before:flex-1 before:bg-zinc-700 after:h-px after:flex-1 after:bg-zinc-700">
        OR
      </p>
      <OauthGoogle>Continue with Google</OauthGoogle>
    </>
  );
}
