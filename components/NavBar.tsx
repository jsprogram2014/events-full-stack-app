import React from "react";
import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link className="logo" href="/">
          <Image src="/icons/logo.svg" alt="logo" width={100} height={100} />
        </Link>
        <ul className="">
          <Link href="/">Home</Link>
          <Link href="/">Events</Link>
          <Link href="/">Create</Link>
        </ul>
      </nav>
    </header>
  );
};
export default NavBar;
