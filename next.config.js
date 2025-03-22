/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config ...
  images: {
    domains: [
      "plum-active-landfowl-217.mypinata.cloud",
      "ideogram.ai",
      "s3-alpha-sig.figma.com",
    ],
  },
  // ... existing config ...
};

module.exports = nextConfig;
