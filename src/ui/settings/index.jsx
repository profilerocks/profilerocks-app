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

const CLASS_ACTIVE = "text-emerald-400!";
const CLASS_NAV_ANCHOR = "H";
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
            navAnchorList[currentSection]?.classList.remove(CLASS_ACTIVE);
            const elAnchorActive = navAnchorList[id];
            elAnchorActive.classList.add(CLASS_ACTIVE);
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

      navAnchorList[currentSection]?.classList.remove(CLASS_ACTIVE);

      currentSection = href?.substring(1);

      sections[currentSection].scrollIntoView();

      const elAnchorActive = navAnchorList[currentSection];
      elAnchorActive.classList.add(CLASS_ACTIVE);
      elAnchorActive.scrollIntoView(navAnchorScrollIntoViewOptions);

      history.pushState(null, "", href);

      selection?.empty();
    }

    for (const a of anchors) {
      const href = a.getAttribute("href");

      if (href) {
        const idSection = href.substring(1);

        if (sections[idSection]) {
          if (a.classList.contains(CLASS_NAV_ANCHOR)) {
            navAnchorList[idSection] = a;
          }

          // @ts-expect-error
          a.addEventListener("click", anchorOnClick);
        }
      }
    }

    Object.freeze(navAnchorList);

    if (sections.hasOwnProperty(currentSection)) {
      const elAnchorActive = navAnchorList[currentSection];

      elAnchorActive.classList.add(CLASS_ACTIVE);
      elAnchorActive.scrollIntoView(navAnchorScrollIntoViewOptions);

      if (currentSection != "home") {
        sections[currentSection].scrollIntoView({ behavior: "instant" });
      }
    } else {
      navAnchorList.home?.classList.add(CLASS_ACTIVE);
      history.replaceState(null, "", "#home");
    }

    function onHashChange() {
      let hash = location.hash.substring(1);

      if (!sections.hasOwnProperty(hash)) {
        hash = "home";
        history.replaceState(null, "", "#" + hash);
      }

      navigator?.vibrate(1);

      autoScrolling = true;

      navAnchorList[currentSection]?.classList.remove(CLASS_ACTIVE);

      const elAnchorActive = navAnchorList[hash];
      elAnchorActive.classList.add(CLASS_ACTIVE);
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
      <nav className="flex overflow-auto border-be border-be-zinc-700 text-zinc-400 shadow-sm select-none *:flex *:min-w-max *:gap-1.5 *:p-2.5 *:transition-colors *:hover:text-zinc-200 *:active:text-zinc-100 lg:mbs-4 lg:flex-col lg:border-be-0 lg:text-2xl lg:*:gap-3.5">
        <a className={"ps-4.5! lg:ps-2.5! " + CLASS_NAV_ANCHOR} href="#home">
          <IconHome width={ICON_DIMENSION} />
          Home
        </a>
        <a className={CLASS_NAV_ANCHOR} href="#email">
          <IconEmail width={ICON_DIMENSION} />
          Email
        </a>
        <a className={CLASS_NAV_ANCHOR} href="#name">
          <IconUserSingle width={ICON_DIMENSION} />
          Name
        </a>
        <a className={CLASS_NAV_ANCHOR} href="#oauth">
          <IconConnect width={ICON_DIMENSION} />
          Linked accounts
        </a>
        <a className={CLASS_NAV_ANCHOR} href="#payments">
          <IconCard width={ICON_DIMENSION} />
          Payments
        </a>
        <a className={CLASS_NAV_ANCHOR} href="#sessions">
          <IconDevices width={ICON_DIMENSION} />
          Sessions
        </a>
        <a className={"pe-4.5! " + CLASS_NAV_ANCHOR} href="#data">
          <IconUserData width={ICON_DIMENSION} />
          Data
        </a>
      </nav>
      <div
        className="mx-auto h-full flex w-full max-w-2xl snap-x snap-mandatory scrollbar-none gap-12 overflow-x-auto scroll-smooth *:min-h-full *:min-w-full *:snap-center *:snap-always *:overflow-y-auto *:px-6 *:pbs-5 *:pbe-12 md:overflow-x-hidden md:scroll-auto"
        ref={sectionsContainerRef}
      >
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
