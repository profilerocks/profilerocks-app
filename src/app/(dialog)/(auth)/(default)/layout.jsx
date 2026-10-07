"use client";

import renderProfile from "@profile.rocks/generator";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { API } from "#src/lib/env";
import markdownRenderer from "#src/lib/markdown";
import globalState from "#src/lib/state";
import SvgLogoLong from "#src/static/logo/long.svg";
import LinkBack from "#src/ui/link/back";
import Minimap from "#src/ui/minimap";
import ProfileList from "#src/ui/profile/entries";
import User from "#src/ui/user";

const API_HOST = new URL(API).host;

/**
 * @function renderMarkdown
 * @param {string} str
 * @returns {string}
 */
function renderMarkdown(str) {
  return markdownRenderer.render(str);
}

/**
 * @function ProfilePreview
 * @returns {React.ReactNode}
 */
function ProfilePreview() {
  const { currentProfile } = useSnapshot(globalState);

  return (
    <section className={"relative flex flex-col" + (currentProfile ? "" : " hidden")} id="preview" title="Profile preview">
      {currentProfile && (
        <>
          <header className="flex items-center gap-1.5 border-be border-zinc-700 bg-zinc-900 p-2">
            <LinkBack className="hide-desktop-large" href="#page" />
            <a
              className="relative min-h-max flex-1 scrollbar-gutter-stable overflow-x-auto overflow-y-visible rounded-lg bg-zinc-950 py-2 text-nowrap shadow-zinc-950 before:sticky before:inset-s-0 before:me-3 before:shadow-md after:sticky after:inset-e-0 after:ms-3 after:shadow-md"
              href={API_HOST + "/" + currentProfile.name_id}
              target="_blank"
            >
              {API_HOST + "/" + currentProfile.name_id}
            </a>
          </header>
          <iframe
            className="w-full flex-1 select-none"
            frameBorder="0"
            srcDoc={renderProfile(
              {
                name_id: currentProfile.name_id,
                public_id: currentProfile.public_id,
                // @ts-expect-error
                data: currentProfile?.data?.filter(({ content }) => content),
                display_name: currentProfile.display_name,
                // lang: currentProfile.lang,
                photo: currentProfile.photo,
                theme: currentProfile.theme_preview || currentProfile.theme,
                watermark: currentProfile.watermark
              },
              markdownRenderer.utils.escapeHtml,
              renderMarkdown
            )}
            title="Preview"
          />
          {currentProfile.theme_preview && (
            <p className="font-sm absolute inset-e-1 inset-bs-13 z-2 rounded-3xl bg-zinc-900 px-3.5 py-2">This is a theme preview</p>
          )}
        </>
      )}
    </section>
  );
}

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function DefaultLayout({ children }) {
  /**
   * @type {React.RefObject<HTMLDivElement|null>}
   */
  const containersRef = useRef(null);

  useEffect(() => {
    const elContainers = containersRef.current;

    if (!elContainers) {
      return;
    }

    let autoScrolling = false;
    let currentSection = location.hash.substring(1);

    const selection = document.getSelection();

    const intersectionObserver = new IntersectionObserver(
      entries => {
        const id = entries.find(entry => entry.isIntersecting)?.target.id;

        if (id) {
          if (id === currentSection) {
            if (autoScrolling) {
              autoScrolling = false;
            }
          } else if (!autoScrolling) {
            currentSection = id;
            history.pushState(null, "", "#" + id);
            // @ts-expect-error
            document.activeElement?.blur();
            selection?.empty();
          }
        }
      },
      { root: elContainers, threshold: 0.5 }
    );

    /**
     * @type {Record<string,Element>}
     */
    const containersRecord = {};

    for (const elSection of elContainers.children) {
      containersRecord[elSection.id] = elSection;
      intersectionObserver.observe(elSection);
    }

    Object.freeze(containersRecord);

    if (currentSection != "side") {
      document.getElementById(currentSection)?.scrollIntoView({ behavior: "instant" });
    }

    function onHashChange() {
      const hash = location.hash.substring(1);
      const el = document.getElementById(hash);

      if (el) {
        navigator?.vibrate?.(1);
        autoScrolling = true;
        currentSection = hash;
        el.scrollIntoView();
        selection?.empty();
      }
    }

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <div
      className="flex flex-1 snap-x snap-mandatory scrollbar-none overflow-x-auto scroll-smooth *:min-w-full *:snap-center *:snap-always *:overflow-y-auto"
      ref={containersRef}
    >
      <section className="z-3 flex flex-col pbe-10" id="side">
        <header className="sticky inset-bs-0 z-1 flex gap-3 px-4 py-3.5 before:absolute before:inset-x-0 before:inset-bs-0 before:-z-1 before:shadow-[0_0_1.75em_3.75em_#000]">
          <Link href="/#side" className="select-none">
            <SvgLogoLong width="16em" />
          </Link>
          {/*<details name={DETAILS_NAME} className={styles["page-header-details"]}>
            <summary><IconBell width={ICON_SIZE} /></summary>
            <div className={styles.dropdown}></div>
          </details>*/}
        </header>
        <User className="m-4" />
        <ProfileList />
        <Minimap className="mbs-auto pbs-8" />
      </section>
      <section className="flex flex-1 basis-3xs scrollbar-gutter-stable flex-col" id="page">
        {children}
      </section>
      <ProfilePreview />
    </div>
  );
}
