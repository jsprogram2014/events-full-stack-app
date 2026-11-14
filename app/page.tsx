import React from "react";
import ExploreButton from "@/components/ExploreButton";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants";
const Page = () => {
  // const eventArray = [
  //   { title: "Apple", image: "/images/event1.png" },
  //   { title: "Nvidia", image: "/images/event2.png" },
  //   { title: "Google", image: "/images/event3.png" },
  //   { title: "Meta", image: "/images/event4.png" },
  //   { title: "Microsoft", image: "/images/event5.png" },
  //   { title: "Netflix", image: "/images/event6.png" },
  // ];
  // const events = [
  //   {
  //     image: "/images/event1.png",
  //     title: "Event 1",
  //     slug: "event-1",
  //     location: "location-1",
  //     date: "Date-1",
  //     time: "Time-1",
  //   },
  // ];
  const eventCardArray = events.map((event, index) => (
    <EventCard
      key={index}
      title={event.title}
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
