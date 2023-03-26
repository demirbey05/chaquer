import { noise2d } from "./perlin2d";
import { Array2D } from "../terrain-helper/types";

describe("testing index file", () => {
  test("empty string should result in zero", () => {
    const height = 300;
    const width = 300;
    let values: Array2D = new Array2D(height, width);

    for (let i = 0; i < 300; i++) {
      for (let j = 0; j < 300; j++) {
        const terrainIndex = noise2d(i * 0.01, j * 0.01);
        values.set(i, j, terrainIndex);
      }
    }
    console.log(values.getMax());
    console.log(values.getMin());
  });
});
