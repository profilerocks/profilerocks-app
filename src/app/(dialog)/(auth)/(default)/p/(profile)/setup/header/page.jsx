import FormProfileDisplayName from "#src/ui/form/profile/display";
import ProfilePhotoEditor from "#src/ui/profile/photo";

export default function PageSetupProfileHeader() {
  return (
    <>
      <h1 className="my-4 text-center text-2xl sm:text-3xl">Add your personal touch</h1>
      <ProfilePhotoEditor />
      <FormProfileDisplayName className="mbs-4" />
    </>
  );
}
