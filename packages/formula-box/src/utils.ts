import { Army } from "./types";

const effectCoeffs = [
  [1, 2, 0.5],
  [2, 1, 0.5],
  [0.5, 2, 1],
];

export const findRemainings = (army: {
  swordsman: number;
  archer: number;
  cavalry: number;
}) => {
  let keys: (keyof typeof army)[] = Object.keys(army) as (keyof typeof army)[];

  let remainings = keys.filter((key) => {
    return army[key] > 0;
  });

  return remainings;
};

export function calculateScoreOne(
  scoreArray: { swordsman: number; archer: number; cavalry: number },
  remaining: string
): number {
  if (remaining === "swordsman") {
    return (
      scoreArray.swordsman + 2 * scoreArray.cavalry + 0.5 * scoreArray.archer
    );
  }
  if (remaining === "archer") {
    return (
      scoreArray.archer + 2 * scoreArray.swordsman + 0.5 * scoreArray.cavalry
    );
  }
  if (remaining === "cavalry") {
    return (
      scoreArray.cavalry + 2 * scoreArray.archer + 0.5 * scoreArray.swordsman
    );
  }
  return 0;
}
export function calculateScoreTwo(
  scoreArray: { swordsman: number; archer: number; cavalry: number },
  remainingOne: "swordsman" | "archer" | "cavalry",
  remainingTwo: "swordsman" | "archer" | "cavalry"
): number {
  let result = 0;
  if (remainingOne === "swordsman") {
    result =
      remainingTwo === "archer"
        ? scoreArray.swordsman + 2 * scoreArray.cavalry
        : scoreArray.swordsman + 0.5 * scoreArray.archer;
  }
  if (remainingOne === "archer") {
    result =
      remainingTwo === "cavalry"
        ? scoreArray.archer + 2 * scoreArray.swordsman
        : scoreArray.archer + 0.5 * scoreArray.cavalry;
  }
  if (remainingOne === "cavalry") {
    result =
      remainingTwo === "swordsman"
        ? scoreArray.cavalry + 2 * scoreArray.archer
        : scoreArray.cavalry + 0.5 * scoreArray.swordsman;
  }

  if (result < 0) {
    if (remainingTwo === "swordsman") {
      return remainingOne === "archer"
        ? scoreArray.swordsman + 2 * result
        : scoreArray.swordsman + 0.5 * result;
    }
    if (remainingTwo === "archer") {
      return remainingOne === "cavalry"
        ? scoreArray.archer + 2 * result
        : scoreArray.archer + 0.5 * result;
    }
    if (remainingTwo === "cavalry") {
      return remainingOne === "swordsman"
        ? scoreArray.cavalry + 2 * result
        : scoreArray.cavalry + 0.5 * result;
    }
  } else {
    if (remainingTwo === "swordsman") {
      return result + scoreArray.swordsman;
    }
    if (remainingTwo === "archer") {
      return result + scoreArray.archer;
    }
    if (remainingTwo === "cavalry") {
      return result + scoreArray.cavalry;
    }
  }
  return 0;
}
