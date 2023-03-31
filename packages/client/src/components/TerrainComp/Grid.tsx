import { TerrainType } from "../../terrain-helper/types";
import grassImg from "../../images/grass.png";
import mountainImg from "../../images/mountain.png";
import seaImg from "../../images/sea.png";
import castleImg from "../../images/castle.png";
import { useTerrain } from "../../context/TerrainContext";
import { useMUD } from "../../MUDContext";
import "../../styles/globals.css";
import CastleSettleModal from "../BootstrapComp/CastleSettleModal";

export type DataProp = {
  width: number;
  height: number;
  values: Array<Array<TerrainType>>;
  pixelStyles: Array<any>;
  isBorder: boolean;
};

function bgImg(data: any) {
  if (data === 1) {
    return `url(${grassImg})`;
  } else if (data === 2) {
    return `url(${seaImg})`;
  } else {
    return `url(${mountainImg})`;
  }
}

function getDataAtrX(event: any) {
  const id = event.target.dataset.row;
  return id;
}

function getDataAtrY(event: any) {
  const id = event.target.dataset.column;
  return id;
}

function canCastleBeSettle(data: any) {
  if (data !== 1) {
    return false;
  }
  return true;
}

export function Grid(data: DataProp) {
  const width = data.width;
  const height = data.height;
  const values = data.values;
  const rows = Array.from({ length: height }, (v, i) => i);
  const columns = Array.from({ length: width }, (v, i) => i);

  const { components, systems } = useMUD();

  const { setCastle, castle, isCastleSettled } = useTerrain();

  const handleClick = async (e: any, row: any, column: any) => {
    const tx =
      canCastleBeSettle(values[row][column]) &&
      !isCastleSettled &&
      (await systems["system.CastleSettle"].executeTyped(
        getDataAtrX(e),
        getDataAtrY(e)
      ));
    if (tx) {
      setCastle({ x: getDataAtrX(e), y: getDataAtrY(e) });
      const tc = await tx.wait();
      console.log(tc);
    }
  };

  return (
    <div className={`inline-grid ${data.isBorder && "border-4 border-black"}`}>
      {rows.map((row) => {
        return columns.map((column) => {
          return (
            <div
              key={`${column},${row}`}
              data-row={`${row}`}
              data-column={`${column}`}
              style={{
                gridColumn: column + 1,
                gridRow: row + 1,
                width: `${data.pixelStyles[1]}px`,
                height: `${data.pixelStyles[1]}px`,
                backgroundImage: `${bgImg(values[row][column])}`,
              }}
              onClick={(e) => {
                handleClick(e, row, column);
              }}
              className={`${
                !data.isBorder &&
                canCastleBeSettle(values[row][column]) &&
                "borderHover"
              }`}
              data-bs-toggle={`${
                canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder &&
                "modal"
              }`}
              data-bs-target={`${
                canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder &&
                "#exampleModal"
              }`}
            ></div>
          );
        });
      })}
      <CastleSettleModal></CastleSettleModal>
    </div>
  );
}
