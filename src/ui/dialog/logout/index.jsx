import { requestUserLogout } from "#src/lib/request";
import { deleteUserState } from "#src/lib/state/user";
import Dialog from "#src/ui/dialog";
import TextDanger from "#src/ui/text/danger";

/**
 * @async
 * @function logOutOnClick
 * @param {React.MouseEvent<HTMLButtonElement>} event
 */
async function logOutOnClick(event) {
  (event.currentTarget || event.target || {}).disabled = true;
  await requestUserLogout();
  deleteUserState();
}

/**
 * @param {Object} props
 * @param {Omit<Parameters<typeof Dialog>[0],"acceptFunction"|"children">} props
 * @returns {React.ReactNode}
 */
export default function DialogLogOut(props) {
  return (
    <Dialog {...props} acceptFunction={logOutOnClick}>
      Are you sure you want to <TextDanger>log out</TextDanger>?
    </Dialog>
  );
}
