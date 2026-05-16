import { requestUserAllSessionsLogout } from "#src/lib/request";
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
  await requestUserAllSessionsLogout();
  deleteUserState();
}

/**
 * @function
 * @param {Omit<Parameters<typeof Dialog>[0],"acceptFunction"|"children">} props
 * @returns {React.ReactNode}
 */
export default function DialogLogOutOfAllSessions(props) {
  return (
    <Dialog {...props} acceptFunction={logOutOnClick}>
      Are you sure you want to <TextDanger>log out of all sessions</TextDanger>?
    </Dialog>
  );
}
