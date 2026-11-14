"use client";
import Image from "next/image";
import posthog from "posthog-js";
import React from "react";

const ExploreButton = () => {
  function handleButtonClick() {
    posthog.capture("events_explored");
    posthog.logger.info("event directory exploration requested");
  }

  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto text-red-50"
      onClick={() => {
        handleButtonClick();
      }}
    >
      <a href="#events">
        Explore Events
        <Image
          src="/icons/arrow-down.svg"
          alt="arrow-down"
          width={24}
          height={24}
        />
      </a>
    </button>
  );
};
export default ExploreButton;
