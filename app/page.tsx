import React from "react";
import ExploreButton from "@/components/ExploreButton";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants";
const Page = () => {
  const eventCardArray = events.map((event, index) => (
    <EventCard
      key={index}
      title={event.title}
      slug={event.slug}
      image={event.image}
      location={event.location}
      date={event.date}
      time={event.time}
    />
  ));

  return (
    <>
      <h1 className="text-center">
        Hub for Every Trending Event <br /> You cant Miss
      </h1>
      <p className="text-center">
        Meetups, Party, Hackathons and More All in One Place
      </p>
      <ExploreButton />
      <ul className="events">{eventCardArray}</ul>
    </>
  );
};
export default Page;
