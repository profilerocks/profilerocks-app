"use client";

import renderProfile from "@profile.rocks/generator";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { API } from "#src/lib/env";
import markdownRenderer from "#src/lib/markdown";
import globalState from "#src/lib/state";
import SvgLogoLong from "#src/static/logo/long.svg";
import LinkBackNormal from "#src/ui/link/back/normal";
import Minimap from "#src/ui/minimap";
import ProfileList from "#src/ui/profile/entries";
import LongWord from "#src/ui/text/long";
import User from "#src/ui/user";
import styles from "./layout.module.scss";

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
  const { currentProfile, currentProfileDataStored } = useSnapshot(globalState);

  let className = styles["section-profile-preview"];

  if (!currentProfile) {
    className += " " + styles["no-profile"];
  }

  return (
    <section className={className} id="preview" title="Profile preview">
      {currentProfile && (
        <>
          <header className={styles["profile-preview-header"]}>
            <LinkBackNormal className="hide-desktop-large" href="#page" />
            <LongWord as="a" className={styles["profile-preview-url"]} href={API + "/" + currentProfile.name_id} target="_blank">
              {API + "/" + currentProfile.name_id}
            </LongWord>
          </header>
          <iframe
            className={styles["iframe-preview-profile"]}
            frameBorder="0"
            srcDoc={renderProfile(
              {
                name_id: currentProfile.name_id,
                public_id: currentProfile.public_id,
                // @ts-expect-error
                data: currentProfileDataStored,
                display_name: currentProfile.display_name,
                // lang: currentProfile.lang,
                photo: currentProfile.photo,
                // theme: currentProfile.theme,
                watermark: currentProfile.watermark
              },
              markdownRenderer.utils.escapeHtml,
              renderMarkdown
            )}
            title="Preview"
          />
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
        navigator?.vibrate(1);
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
    <div className={styles["sections-container"]} ref={containersRef}>
      <section className={styles["section-side"]} id="side">
        <header className={styles["side-header"]}>
          <Link href="/#side" className={styles["side-header-a-logo"]}>
            <SvgLogoLong width="16em" />
          </Link>
          {/*<details name={DETAILS_NAME} className={styles["page-header-details"]}>
            <summary><IconBell width={ICON_SIZE} /></summary>
            <div className={styles.dropdown}></div>
          </details>*/}
        </header>
        <User />
        <ProfileList />
        <Minimap className={styles.minimap} />
      </section>
      <section className={styles["section-page"]} id="page">
        {children}
      </section>
      <ProfilePreview />
    </div>
  );
}
