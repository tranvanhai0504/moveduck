"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { LoginButton } from "../login-button";
import Link from "next/link";

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <div className="w-full flex justify-between py-2 items-center px-10 z-20 relative">
      <div className="flex items-center gap-x-4">
        <h1 className="text-2xl font-semibold">
          Move<b className="text-primary font-semibold">Duck</b>
        </h1>
        <ul
          className="relative flex w-fit rounded-full bg-white p-1 text-base"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
        >
          <Link href="/">
            <Tab setPosition={setPosition}>Home</Tab>
          </Link>
          <Link href="/generate">
            <Tab setPosition={setPosition}>Generate</Tab>
          </Link>
          <Link href="/dashboard">
            <Tab setPosition={setPosition}>Dashboard</Tab>
          </Link>
          <Cursor position={position} />
        </ul>
      </div>
      <LoginButton />
    </div>
  );
}

const Tab = ({
  children,
  setPosition,
}: {
  children: React.ReactNode;
  setPosition: any;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1 text-sm text-white mix-blend-difference md:px-5 md:py-2 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-black md:h-10"
    />
  );
};

export default NavHeader;
