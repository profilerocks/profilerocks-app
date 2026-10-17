import FormDisplayName from "#src/ui/form/display";
import IconPencil from "#src/icons/pencil.svg";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function SettingsUserName() {
  return (
    <div id="name">
      <h1>Contact name</h1>
      <p>Used for contact information. You can always change it.</p>
      <FormDisplayName hrefBack="#home">
        Change
        <IconPencil width="1.25em" />
      </FormDisplayName>
    </div>
  );
}
