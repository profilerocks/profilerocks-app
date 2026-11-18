import { FormProfileNameIdPageWrapper } from "#src/ui/form/profile/name";
import LinkButtonBack from "#src/ui/link/button/back";

export default function PageCreateProfile() {
  return (
    <>
      <LinkButtonBack className="ms-2 mbs-3 max-w-max pe-3.5 lg:hidden" href="#side">
        Home
      </LinkButtonBack>
      <div className="px-4 pbe-10">
        <h1 className="my-4 text-center text-3xl sm:text-4xl lg:my-6 lg:text-5xl">Create a new profile</h1>
        <FormProfileNameIdPageWrapper />
      </div>
    </>
  );
}
