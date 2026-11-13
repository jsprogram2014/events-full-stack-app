export interface Event {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    image: "/images/event1.png",
    title: "React Conf 2026",
    slug: "react-conf-2026",
    location: "San Francisco, CA",
    date: "2026-05-15",
    time: "09:00 AM",
  },
  {
    image: "/images/event2.png",
    title: "NodeConf EU 2026",
    slug: "nodeconf-eu-2026",
    location: "Berlin, Germany",
    date: "2026-06-20",
    time: "10:00 AM",
  },
  {
    image: "/images/event3.png",
    title: "PyCon US 2026",
    slug: "pycon-us-2026",
    location: "Salt Lake City, UT",
    date: "2026-05-20",
    time: "08:00 AM",
  },
  {
    image: "/images/event4.png",
    title: "KubeCon + CloudNativeCon 2026",
    slug: "kubecon-cloudnativecon-2026",
    location: "Los Angeles, CA",
    date: "2026-04-10",
    time: "09:00 AM",
  },
  {
    image: "/images/event5.png",
    title: "JSWorld Conference 2026",
    slug: "jsworld-conference-2026",
    location: "London, UK",
    date: "2026-07-05",
    time: "09:30 AM",
  },
  {
    image: "/images/event6.png",
    title: "Hackathon: Build for Good",
    slug: "hackathon-build-for-good",
    location: "Remote / Virtual",
    date: "2026-08-12",
    time: "12:00 PM",
  },
];
