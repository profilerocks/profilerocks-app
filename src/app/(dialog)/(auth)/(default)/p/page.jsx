import { FormProfileNameIdPageWrapper } from "#src/ui/form/profile/name";
import LinkBack from "#src/ui/link/back";

export default function PageCreateProfile() {
  return (
    <>
      <LinkBack className="ms-2 mbs-3 max-w-max sm:hidden" href="#side">
        Home
      </LinkBack>
      <div className="px-4">
        <h1 className="my-4 text-center text-3xl sm:text-4xl">Create a new profile</h1>
        <FormProfileNameIdPageWrapper />
      </div>
    </>
  );
}
