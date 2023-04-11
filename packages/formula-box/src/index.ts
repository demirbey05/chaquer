import { functions } from "./functions";
import { simulation } from "./simulation";
import { logDetails } from "./logDetails";
import { argv } from "process";

const main = () => {
  const argument = argv[2] as unknown as number;

  if (argument >= functions.length) {
    throw new Error("Function is not found");
  }

  simulation(100, functions[argument], 100);
};

main();
