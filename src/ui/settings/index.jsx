"use client";

import { useEffect, useRef } from "react";
import IconCard from "#src/icons/card.svg";
import IconConnect from "#src/icons/connect.svg";
import IconDevices from "#src/icons/devices.svg";
import IconEmail from "#src/icons/email.svg";
import IconHome from "#src/icons/home.svg";
import IconUserData from "#src/icons/user/data.svg";
import IconUserSingle from "#src/icons/user/single.svg";
import SettingsData from "#src/ui/settings/data";
import SettingsEmail from "#src/ui/settings/email";
import SettingsHome from "#src/ui/settings/home";
import SettingsName from "#src/ui/settings/name";
import SettingsOauth from "#src/ui/settings/oauth";
import SettingsPayments from "#src/ui/settings/payments";
import SettingsSessions from "#src/ui/settings/sessions";
import styles from "./index.module.scss";

const ICON_DIMENSION = "1.125em";

/**
 * @type {Readonly<ScrollIntoViewOptions>}
 */
const navAnchorScrollIntoViewOptions = Object.freeze({
  behavior: "smooth",
  block: "center",
  inline: "center"
});

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function Settingss() {
  /**
   * @type {React.RefObject<HTMLDivElement|null>}
   */
  const sectionsContainerRef = useRef(null);

  useEffect(() => {
    const elContainerSections = sectionsContainerRef.current;

    if (!elContainerSections) {
      return;
    }

    let autoScrolling = false;
    let currentSection = location.hash.substring(1);

    /**
     * @type {Record<string,Element>}
     */
    const navAnchorList = {};

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
            navAnchorList[currentSection]?.classList.remove(styles.active);
            const elAnchorActive = navAnchorList[id];
            elAnchorActive.classList.add(styles.active);
            elAnchorActive.scrollIntoView(navAnchorScrollIntoViewOptions);
            currentSection = id;
            history.pushState(null, "", "#" + id);
            // @ts-expect-error
            document.activeElement?.blur();
            selection?.empty();
          }
        }
      },
      { root: elContainerSections, threshold: 0.5 }
    );

    /**
     * @type {Record<string,Element>}
     */
    const sections = {};

    for (const elSection of elContainerSections.children) {
      sections[elSection.id] = elSection;
      intersectionObserver.observe(elSection);
    }

    Object.freeze(sections);

    const anchors = document.querySelectorAll("a[href^='#']");

    /**
     *
     * @param {MouseEvent} event
     */
    function anchorOnClick(event) {
      event.preventDefault();

      autoScrolling = true;

      // @ts-expect-error
      const href = event.currentTarget?.getAttribute("href");

      navAnchorList[currentSection]?.classList.remove(styles.active);

      currentSection = href?.substring(1);

      sections[currentSection].scrollIntoView();

      const elAnchorActive = navAnchorList[currentSection];
      elAnchorActive.classList.add(styles.active);
      elAnchorActive.scrollIntoView(navAnchorScrollIntoViewOptions);

      history.pushState(null, "", href);

      selection?.empty();
    }

    for (const a of anchors) {
      const href = a.getAttribute("href");

      if (href) {
        const idSection = href.substring(1);

        if (sections[idSection]) {
          if (a.classList.contains(styles["a-setting"])) {
            navAnchorList[idSection] = a;
          }

          // @ts-expect-error
          a.addEventListener("click", anchorOnClick);
        }
      }
    }

    Object.freeze(navAnchorList);

    if (currentSection in sections) {
      const elAnchorActive = navAnchorList[currentSection];
      elAnchorActive.classList.add(styles.active);
      elAnchorActive.scrollIntoView(navAnchorScrollIntoViewOptions);

      if (currentSection != "home") {
        sections[currentSection].scrollIntoView({ behavior: "instant" });
      }
    } else {
      navAnchorList.home?.classList.add(styles.active);
      history.replaceState(null, "", "#home");
    }

    function onHashChange() {
      let hash = location.hash.substring(1);

      if (!(hash in sections)) {
        hash = "home";
        history.replaceState(null, "", "#" + hash);
      }

      navigator?.vibrate(1);

      autoScrolling = true;

      navAnchorList[currentSection]?.classList.remove(styles.active);

      const elAnchorActive = navAnchorList[hash];
      elAnchorActive.classList.add(styles.active);
      elAnchorActive.scrollIntoView(navAnchorScrollIntoViewOptions);

      currentSection = hash;

      sections[hash].scrollIntoView();

      selection?.empty();
    }

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };

    // Think of another faster way to fix the scrollbar in Firefox and Safari when window is resized
    /*function instantScrollHash() {
      sectionsDict[currentSection].scrollIntoView({ behavior: "instant" })
    }*/
  }, []);

  return (
    <>
      <aside className={styles["aside-settings"]}>
        <nav>
          <ul className={styles["ul-settings"]}>
            <li className={styles["li-setting"]}>
              <a href="#home" className={styles["a-setting"]}>
                <IconHome width={ICON_DIMENSION} />
                Home
              </a>
            </li>
            <li className={styles["li-setting"]}>
              <a href="#email" className={styles["a-setting"]}>
                <IconEmail width={ICON_DIMENSION} />
                Email
              </a>
            </li>
            <li className={styles["li-setting"]}>
              <a href="#name" className={styles["a-setting"]}>
                <IconUserSingle width={ICON_DIMENSION} />
                Name
              </a>
            </li>
            <li className={styles["li-setting"]}>
              <a href="#oauth" className={styles["a-setting"]}>
                <IconConnect width={ICON_DIMENSION} />
                Linked accounts
              </a>
            </li>
            <li className={styles["li-setting"]}>
              <a href="#payments" className={styles["a-setting"]}>
                <IconCard width={ICON_DIMENSION} />
                Payments
              </a>
            </li>
            {/*<li className={styles["li-setting"]}>
              <Link href="#profiles" className={styles["a-setting"]}>
                <IconUserMultiple width={ICON_DIMENSION} />
                Profiles
              </Link>
            </li>*/}
            <li className={styles["li-setting"]}>
              <a href="#sessions" className={styles["a-setting"]}>
                <IconDevices width={ICON_DIMENSION} />
                Sessions
              </a>
            </li>
            <li className={styles["li-setting"]}>
              <a href="#data" className={styles["a-setting"]}>
                <IconUserData width={ICON_DIMENSION} />
                Data
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className={styles["settings-container"]} ref={sectionsContainerRef}>
        <SettingsHome />
        <SettingsEmail />
        <SettingsName />
        <SettingsOauth />
        <SettingsPayments />
        <SettingsSessions />
        <SettingsData />
      </div>
    </>
  );
}
