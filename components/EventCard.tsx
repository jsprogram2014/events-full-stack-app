"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

interface Props {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

const EventCard = ({ image, title, slug, location, date, time }: Props) => {
  return (
    <li id="event-card">
      <Link
        href="/"
        onClick={() => {
          posthog.capture("event_card_selected", { event_slug: slug });
          posthog.logger.info("event card selected", { event_slug: slug });
        }}
      >
        <Image
          src={image}
          alt="event image"
          width={400}
          height={300}
          className="poster"
        />
        <div className="flex flex-row gap-2">
          <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
          <p>{location}</p>
        </div>

        <p className="title">{title}</p>

        <div className="datetime">
          <div>
            <Image
              src="/icons/calendar.svg"
              alt="date"
              width={14}
              height={14}
            />
            <p>{date}</p>
          </div>
          <div>
            <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
            <p>{time}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};
export default EventCard;
