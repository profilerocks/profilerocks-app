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

const CLASS_ACTIVE = "!text-emerald-400"
const ICON_DIMENSION = "1.25em";

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
          if (a.classList.contains("H")) {
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

      if (elAnchorActive) {
        elAnchorActive.classList.add(CLASS_ACTIVE);
        elAnchorActive.scrollIntoView(navAnchorScrollIntoViewOptions);

        if (currentSection != "home") {
          sections[currentSection].scrollIntoView({ behavior: "instant" });
        }
      }
    } else {
      navAnchorList.home?.classList.add(CLASS_ACTIVE);
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
      <nav
        className="z-1 shadow-sm flex border-be border-be-zinc-700 text-zinc-400 overflow-auto scrollbar-none md:flex-col md:mbs-4 md:border-be-0 md:text-2xl *:flex *:gap-1.5 *:transition-colors *:p-2.5 *:hover:text-zinc-200 *:active:text-zinc-100 md:*:gap-3.5"
      >
        <a className="ps-4.5 H" href="#home">
          <IconHome width={ICON_DIMENSION} />
          Home
        </a>
        <a className="H" href="#email">
          <IconEmail width={ICON_DIMENSION} />
          Email
        </a>
        <a className="H" href="#name">
          <IconUserSingle width={ICON_DIMENSION} />
          Name
        </a>
        <a className="H" href="#oauth">
          <IconConnect width={ICON_DIMENSION} />
          Linked accounts
        </a>
        <a className="H" href="#payments">
          <IconCard width={ICON_DIMENSION} />
          Payments
        </a>
        <a className="H" href="#sessions">
          <IconDevices width={ICON_DIMENSION} />
          Sessions
        </a>
        <a className="pe-4.5 H" href="#data">
          <IconUserData width={ICON_DIMENSION} />
          Data
        </a>
      </nav>
      <div
        className="flex gap-12 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none max-w-2xl md:overflow-x-hidden md:scroll-auto *:px-6 *:pbe-12 *:min-w-full *:overflow-y-auto *:snap-center *:snap-always"
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
