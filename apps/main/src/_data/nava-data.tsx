import { BoxingGloveIcon, EnvelopeSimpleIcon, SeatbeltIcon, UserIcon } from "@phosphor-icons/react";

  export const navItems = {
    mainNav: [
      {
        title: "",
        url: "#",
        roles: ["talent"],
        items: [
          {
            title: "Home",
            url: "/talent-dashboard",
            icon: BoxingGloveIcon,
            isActive: false,
          },
          {
            title: "My Inbox",
            url: "/message",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
        ],
      },
    ],
    hackSpace: [
      {
        title: "Hackspace",
        roles: ["talent"],
        url: "#",
        items: [
          {
            title: "Projects",
            url: "/projects",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
          {
            title: "Hackers",
            url: "/hackers",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
          {
            title: "Mentors",
            url: "/mentors",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
          {
            title: "About",
            url: "/hack-ogbomoso",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
          {
            title: "Resources",
            url: "/resources",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
          {
            title: "Evaluation",
            url: "/evaluation",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
          {
            title: "Analytics",
            url: "/analytics",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
        ],
      },
    ],
    workSpace: [
      {
        title: "Sermon Management",
        roles: ["staff", "preacher"],
        url: "#",
        items: [
          {
            title: "Hackers",
            url: "/hackers",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
          {
            title: "Series",
            url: "/my-series",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
          {
            title: "Drafts",
            url: "/user-draft",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
          {
            title: "Trash",
            url: "/user-trash",
            icon: EnvelopeSimpleIcon,
            isActive: false,
          },
        ],
      },
    ],
  };
  
  export const navFooterItems = [
    {
      title: "Account",
      url: "/account",
      icon: UserIcon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SeatbeltIcon,
    },
  ];
  