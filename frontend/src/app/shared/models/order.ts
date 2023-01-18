import { Meal } from "./meal";
import { Profile } from "./profile";

export interface Order {
  id: string;
  profile: Profile;
  date: string;
  meal: Meal;
  guestName: string;
  isBanditplate: boolean;
}
