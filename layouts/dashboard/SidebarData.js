import { Icon } from "@iconify/react";

const dashboard = "majesticons:dashboard";
const profile = "vs:profile";
const account = "bx:bxs-user-account";
const category = "ic:outline-category";
const reportIcon = "carbon:report";
const faq = "eva:question-mark-circle-fill";
const getIcon = (icon) => <Icon icon={icon} width={22} height={22} />;

const general = [
  {
    text: "beranda",
    icon: getIcon(dashboard),
    to: "/home",
  },
  {
    text: "profil",
    icon: getIcon(profile),
    to: "/profile",
  },
];

const operational = [
  {
    text: "buat akun",
    to: "/create/account",
    icon: getIcon(account),
  },
  {
    text: "buat laporan",
    to: "/create/report",
    icon: getIcon(reportIcon),
  },
  {
    text: "buat kategori",
    to: "/create/category",
    icon: getIcon(category),
  },
  {
    text: "buat faq",
    to: "/create/faq",
    icon: getIcon(faq),
  },
];

const report = [
  {
    text: "tabel akun",
    to: "/table/account",
    icon: getIcon(account),
  },
  {
    text: "tabel  laporan",
    to: "/table/report",
    icon: getIcon(reportIcon),
  },
  {
    text: "tabel  kategori",
    to: "/table/category",
    icon: getIcon(category),
  },
  {
    text: "tabel faq",
    to: "/table/faq",
    icon: getIcon(faq),
  },
];

export { general, report, operational };
