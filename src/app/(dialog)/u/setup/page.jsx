import IconArrowRight from "#src/icons/arrow/right.svg";
import IconPencil from "#src/icons/pencil.svg";
import FormDisplayName from "#src/ui/form/display";

export default function PageSetupUserName() {
  return (
    <>
      <h1 className="text-3xl">How would you like to be addressed?</h1>
      <p className="text-zinc-300 mbs-3 mbe-4">This information will be used to store your contact information. You can always change it later.</p>
      <FormDisplayName hrefNext="/">
        <IconPencil width="1.5em" />
        Set contact name
        <IconArrowRight className="ms-auto" width="1.25em" />
      </FormDisplayName>
    </>
  );
}
