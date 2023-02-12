import {Meal} from "../../../shared/models/meal";
import {Profile} from "../../../shared/models/profile";

export interface Mealoverview {
  meal: Meal;
  total: number;
  users: [Profile];
}
