import React from "react";
import Link from "next/link";
import Image from "next/image";
interface Props {
  image: string;
  title: string;
}

const EventCard = ({ image, title }: Props) => {
  return (
    <li id="event-card">
      <Link href="/">
        <Image
          src={image}
          alt="event image"
          width={400}
          height={300}
          className="poster"
        />
        <p className="title">{title}</p>
      </Link>
    </li>
  );
};
export default EventCard;
