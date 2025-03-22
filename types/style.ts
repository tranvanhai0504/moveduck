export type TStyle = {
  id: number;
  image: string;
  imageObjectStyle: "contain" | "cover" | "none";
  backgroundColor: string;
  containerStyle: {
    border: string;
    borderRadius: string;
    backgroundColor: string;
    opacity: number;
  };
  titleTextColor: string;
  descriptionTextColor: string;
  buttonsStyle: {
    buttonOne: {
      backgroundColor: string;
      borderColor: string;
      textColor: string;
      borderRadius: string;
    };
    buttonTwo: {
      backgroundColor: string;
      borderColor: string;
      textColor: string;
      borderRadius: string;
    };
    buttonThree: {
      backgroundColor: string;
      borderColor: string;
      textColor: string;
      borderRadius: string;
    };
    buttonFour: {
      backgroundColor: string;
      borderColor: string;
      textColor: string;
      borderRadius: string;
    };
  };
};

export const STYLES: TStyle[] = [
  {
    id: 0,
    image:
      "https://s3-alpha-sig.figma.com/img/655a/f90b/83c835d51c009f2644f648d076afc578?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=CTAHDu~-zvju70HplU979A6f10ZUP42ztcSsxLtdVKPUl6gdcuydq6fONfLMB52doM-pxbBpdHyxhT2Qn7US1UmMGQvBboE9pZlO~tojmPY7bWBj9VvCx2uHWgCSjcUHsEPUnm9bYMM-hb8v8mBt4GVQjKTUlxYVgue6GPq15Gk5MOV13eRaIFfhb4ZYgdEYkcfT8BXCYptZ1UrYN0WmQ6e2q4pD6HQBISc94A9qM5NIFrho8V1UoRBiHkQFAp2wRXe0e3ZuKZSPdNaNNTbGL9wRcUJkKy0Vomj6vpIpx3RhxSR9ESdFPRyX3-D5jVPF1qozKAkXgVGvpv3hmb-Hdg__",
    containerStyle: {
      border: "1px solid #FFBDBD",
      borderRadius: "1rem",
      backgroundColor: "#C7BCBC80",
      opacity: 100,
    },
    titleTextColor: "#ffffff",
    descriptionTextColor: "#FFFFFFB2",
    buttonsStyle: {
      buttonOne: {
        backgroundColor: "#FFFFFF",
        borderColor: "",
        textColor: "#000000",
        borderRadius: "9999px",
      },
      buttonTwo: {
        backgroundColor: "#FFFFFF",
        borderColor: "",
        textColor: "#000000",
        borderRadius: "9999px",
      },
      buttonThree: {
        backgroundColor: "#FFFFFF",
        borderColor: "",
        textColor: "#000000",
        borderRadius: "9999px",
      },
      buttonFour: {
        backgroundColor: "#FFFFFF",
        borderColor: "",
        textColor: "#000000",
        borderRadius: "9999px",
      },
    },
    imageObjectStyle: "cover",
    backgroundColor: "",
  },
  {
    id: 1,
    image:
      "https://s3-alpha-sig.figma.com/img/676f/2151/80e832ab1e7460ea17a15c64ed25c9ca?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GYzMzyCEH9fC4WRA86extEhkZn~BjroVPIyAp2UazrB77G~xFjEvG504Ji8EUoZHnvkFcygqbcXc58I5n-IsNHpiqOesIc7If1f-tb7OyHMtxKOPtmOjOJzmbyiJ~8TupkxZ0Y31Kss~fvavyiuTGdXmE9wgK3Zig13B2QtCCP-RZRvabZDhn3Sa3qUyZcxnw-FrXCDUoeHfiEJekTm6tS2p4ebX7-x4QpvyN4ZjXtFh515cGhtiHMPYRpxQsPfntx0x-V8eDZVCEagHIVmM76ZQkI6f58-FDyrWPcDp-jWJXU3PjAh52fsFLiwVNqFKDFcam86IyCrz9gs7vemXKg__",
    containerStyle: {
      border: "2px solid #000000",
      borderRadius: "0",
      backgroundColor: "#ffffff",
      opacity: 100,
    },
    titleTextColor: "#000000",
    descriptionTextColor: "#000000",
    buttonsStyle: {
      buttonOne: {
        backgroundColor: "#EE2B3C",
        borderColor: "#000000",
        textColor: "#ffffff",
        borderRadius: "0",
      },
      buttonTwo: {
        backgroundColor: "#FEBD25",
        borderColor: "#000000",
        textColor: "#000000",
        borderRadius: "0",
      },
      buttonThree: {
        backgroundColor: "#000000",
        borderColor: "#000000",
        textColor: "#ffffff",
        borderRadius: "0",
      },
      buttonFour: {
        backgroundColor: "#196EA7",
        borderColor: "#000000",
        textColor: "#ffffff",
        borderRadius: "0",
      },
    },
    imageObjectStyle: "cover",
    backgroundColor: "",
  },
  {
    id: 2,
    image:
      "https://s3-alpha-sig.figma.com/img/2c41/2c82/8ed1f8aaca3dbad748fe4da3e8c94a9b?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=h-d0qOxq9Boo1uI9NvD2RmTP7W7geUrsnOZhidApil5rZvhqf2mVH2Q76NTs6RsymfUJceT0Z2x8aOdfmVXh~dTznVSNMjb3Hc8GhzX0oneICmYo4qIsDcQra9ezFVfrhzqmaV2pKlb6B2u-dYeLAM~erPaAwLx2pbDGVfna9U9314SxEsqDYvuPDEYiNTkalKN1IZ1hs06M1rnaJx-L7EUkxo3WC2H6ihXguPPURRfLZhKHYxx3wFSYx8KpB1NgQYKg7n6Al4Acpbg1QwkyGJBo5wp35vkmkmLRPZrIwwEIwwXWUa1ZfWEcC9pTibbZkC0xYYDg8Hn7PZF~IyYN-Q__",
    containerStyle: {
      border: "1px solid white",
      borderRadius: "1rem",
      backgroundColor: "white",
      opacity: 100,
    },
    titleTextColor: "#000000",
    descriptionTextColor: "#000000",
    buttonsStyle: {
      buttonOne: {
        backgroundColor: "#AEAAAA5C",
        borderColor: "transparent",
        textColor: "#000000",
        borderRadius: "9999px",
      },
      buttonTwo: {
        backgroundColor: "#AEAAAA5C",
        borderColor: "transparent",
        textColor: "#000000",
        borderRadius: "9999px",
      },
      buttonThree: {
        backgroundColor: "#AEAAAA5C",
        borderColor: "transparent",
        textColor: "#000000",
        borderRadius: "9999px",
      },
      buttonFour: {
        backgroundColor: "#AEAAAA5C",
        borderColor: "transparent",
        textColor: "#000000",
        borderRadius: "9999px",
      },
    },
    imageObjectStyle: "cover",
    backgroundColor: "",
  },
  {
    id: 3,
    image:
      "https://s3-alpha-sig.figma.com/img/e406/1d22/1623d1fb09d31f3e9594d9babbb257ed?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GlhHhRlft0LNCQigfB~nk8aXVNwtHtpPCBY8Inq6PdsvM61jZGV2hAhZElsrO3JygnM87zwKkUCtJ2sPVpqkN9E9bswq6f44VPC8YKI5rDcQ1SXS1RAKmSbYMLnsIjjNps~t0JBasoB6UMl2q6TH7ibGt8Q2UISnIs188cW25W9iyt97VZpHAcfstZcb9DAdeeRS-yx9wJU1CyAKn1jTXz4s4JdZyIzPAQo0lnqZi4QHNhcre3ZB8M-sKZTxtF7G6T7z2Rj4yjvNA7AmfWsnSomMgzlmgRz6AGUtngRSLqdCU5R7ys~R8H6WaqYudKjTQrqO2Xv3UbhmAULwOmBLCA__",
    containerStyle: {
      border: "none",
      borderRadius: "1rem",
      backgroundColor: "#FFF6DE",
      opacity: 100,
    },
    titleTextColor: "#000000",
    descriptionTextColor: "#000000",
    buttonsStyle: {
      buttonOne: {
        backgroundColor: "#D1F265",
        borderColor: "#00000000",
        textColor: "#000000",
        borderRadius: "9999px",
      },
      buttonTwo: {
        backgroundColor: "#FFDA77",
        borderColor: "#00000000",
        textColor: "#000000",
        borderRadius: "9999px",
      },
      buttonThree: {
        backgroundColor: "#A4FFF9",
        borderColor: "#00000000",
        textColor: "#000000",
        borderRadius: "9999px",
      },
      buttonFour: {
        backgroundColor: "#B5B4FF",
        borderColor: "#00000000",
        textColor: "#000000",
        borderRadius: "9999px",
      },
    },
    imageObjectStyle: "contain",
    backgroundColor: "linear-gradient(180deg, #FEBCFF 0%, #FFFEF7 100%)",
  },
];
