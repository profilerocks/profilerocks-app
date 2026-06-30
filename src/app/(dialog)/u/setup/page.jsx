import ArrowRight from "#src/ui/arrow/right";
import IconPencil from "#src/icons/pencil.svg";
import FormDisplayName from "#src/ui/form/display";

export default function PageSetupUserName() {
  return (
    <>
      <h1>How would you like to be addressed?</h1>
      <p>This information will be used to store your contact information for now. You can always change it later.</p>
      <FormDisplayName hrefNext="/">
        <IconPencil width="1.5em" />
        Set contact name
        <ArrowRight />
      </FormDisplayName>
    </>
  );
}
