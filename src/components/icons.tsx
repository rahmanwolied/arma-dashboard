import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCommand,
  IconCreditCard,
  IconFile,
  IconFileText,
  IconHelpCircle,
  IconPhoto,
  IconDeviceLaptop,
  IconLayoutDashboard,
  IconLoader2,
  IconLogin,
  IconProps,
  IconShoppingBag,
  IconMoon,
  IconDotsVertical,
  IconPizza,
  IconPlus,
  IconSettings,
  IconSun,
  IconTrash,
  IconBrandTwitter,
  IconUser,
  IconUserCircle,
  IconUserEdit,
  IconUserX,
  IconX,
  IconLayoutKanban,
  IconBrandGithub,
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconShield,
  IconShieldCheck,
  IconCurrencyDollar,
  IconDroplet,
  IconHeart,
  IconMedicalCross,
  IconShieldExclamation
} from '@tabler/icons-react';
import { PiCowDuotone } from 'react-icons/pi';

export type Icon = React.ComponentType<IconProps>;

export const Icons = {
  dashboard: IconLayoutDashboard,
  logo: IconCommand,
  login: IconLogin,
  close: IconX,
  product: IconShoppingBag,
  spinner: IconLoader2,
  kanban: IconLayoutKanban,
  checkCircle: IconCircleCheck,
  alertCircle: IconAlertCircle,
  xCircle: IconCircleX,
  cattle: PiCowDuotone,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  transaction: IconCreditCard,
  trash: IconTrash,
  employee: IconUserX,
  post: IconFileText,
  page: IconFile,
  userPen: IconUserEdit,
  user2: IconUserCircle,
  media: IconPhoto,
  settings: IconSettings,
  billing: IconCreditCard,
  ellipsis: IconDotsVertical,
  add: IconPlus,
  warning: IconAlertTriangle,
  user: IconUser,
  arrowRight: IconArrowRight,
  help: IconHelpCircle,
  pizza: IconPizza,
  sun: IconSun,
  moon: IconMoon,
  laptop: IconDeviceLaptop,
  github: IconBrandGithub,
  twitter: IconBrandTwitter,
  check: IconCheck,

  // Cattle status icons
  isInseminated: IconMedicalCross, // Medical cross for artificial insemination
  isLactating: IconDroplet, // Water droplet representing milk
  isPregnant: IconHeart, // Heart representing pregnancy/new life
  isQuarantined: IconShieldExclamation, // Shield with exclamation for quarantine
  isSold: IconCurrencyDollar, // Dollar sign for sold status
  isVaccinated: IconShieldCheck // Shield with check for vaccination protection
};
