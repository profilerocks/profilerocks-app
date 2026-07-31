import Link from "next/link";
import IconSettings from "#src/icons/settings.svg";
import { UserDisplayName, UserEmail } from "#src/ui/user/client";

/**
 * @function
 * @param {object} props
 * @param {string} [props.className]
 * @returns {React.ReactNode}
 */
export default function User({ className: customClassName }) {
  return (
    <div className={"flex items-center gap-4 rounded-xl bg-zinc-900 p-3" + (customClassName ? " " + customClassName : "")}>
      <div className="flex-1 overflow-hidden">
        <UserDisplayName />
        <UserEmail />
      </div>
      <Link
        className="group flex min-w-max items-center gap-2.5 rounded-3xl p-1.5 font-medium text-teal-500 transition-colors select-none hover:bg-zinc-800 hover:text-teal-400 active:bg-zinc-700 active:text-teal-300"
        href="/u/settings"
        title="User settings"
      >
        <IconSettings className="transition-transform duration-1000 group-hover:rotate-360" width="1.75em" />
      </Link>
    </div>
  );
}
