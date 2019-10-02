export enum Direction {
  LEFT = "L",
  STAY = "S",
  RIGHT = "R"};

export interface Transition{
  r: string;
  w: string;
  d: Direction
}
