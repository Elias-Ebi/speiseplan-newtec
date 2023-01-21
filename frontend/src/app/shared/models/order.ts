import { Temporal } from '@js-temporal/polyfill';
import { Meal } from "./meal";
import { Profile } from "./profile";

export interface Order {
  id: string;
  profile: Profile;
  total: number;
  date: string;
  meal: Meal;
  isGuestOrder: boolean;
  guestName: string | undefined;
  isOrderOffered: boolean;
}
