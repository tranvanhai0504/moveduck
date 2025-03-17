import { cookies } from "next/headers";

import Script from "next/script";
import NavHeader from "@/components/layout/header";
import { StarsBackground } from "@/components/ui/stars-background";
import Image from "next/image";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <div className="flex flex-col relative px-10 bg-[#F4F5F7] min-h-screen">
        {/* background */}
        <div className="h-screen w-screen fixed top-0 left-0 z-0">
          <svg
            width="371"
            height="297"
            viewBox="0 0 371 297"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_389_568)">
              <path
                d="M283 -14C283 109.159 183.159 209 60 209C-63.1595 209 -163 109.159 -163 -14C-163 -137.16 -63.1595 -237 60 -237C183.159 -237 283 -137.16 283 -14Z"
                fill="url(#paint0_radial_389_568)"
                fillOpacity="0.48"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_389_568"
                x="-251"
                y="-325"
                width="622"
                height="622"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="44"
                  result="effect1_foregroundBlur_389_568"
                />
              </filter>
              <radialGradient
                id="paint0_radial_389_568"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(59.9999 95.0001) rotate(90) scale(223)"
              >
                <stop stopColor="#F4A625" />
                <stop offset="1" stopColor="#FFDA34" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
          <Image
            src={"/images/bg-topright.svg"}
            alt="img"
            width={500}
            height={500}
            className="absolute top-0 right-0"
          />

          <Image
            src={"/images/bg-bottom.svg"}
            alt="img"
            width={500}
            height={500}
            className="absolute bottom-0 right-0"
          />
        </div>
        <NavHeader />
        <div className="w-full relative z-10 grow">{children}</div>
      </div>
    </>
  );
}
