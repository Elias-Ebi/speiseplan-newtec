import { Meal } from "../../../shared/models/meal";
import { Profile } from "../../../shared/models/profile";

export interface MealOverview {
  meal: Meal;
  total: number;
  users: Profile[];
  guests: Map<string, Profile>;
}

/*
interface GuestTree {
  user: string;
  guests?: string[]
}*/
