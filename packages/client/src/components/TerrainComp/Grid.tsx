import { TerrainType } from "../../terrain-helper/types";
import grassImg from "../../images/grass.png";
import mountainImg from "../../images/mountain.png";
import seaImg from "../../images/sea.png";
import { useTerrain } from "../../context/TerrainContext";
import "../../styles/globals.css";
import CastleSettleModal from "../BootstrapComp/CastleSettleModal";
import { useCastlePositions } from "../../hooks/useCastlePositions";
import { useEffect, useState } from "react";
import { getBurnerWallet } from "../../mud/getBurnerWallet";
import { useBurnerWallets } from "../../hooks/useBurnerWallets";
import { useCastlePositionByAddress } from "../../hooks/useCastlePositionByAddress";
import ArmySettleModal from "../BootstrapComp/ArmySettleModal";
import { useArmyPositions } from "../../hooks/useArmyPositions";
import { useUserArmy } from "../../hooks/useUserArmy";

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
  const id = event.target.dataset.column;
  return id.toString();
}

function getDataAtrY(event: any) {
  const id = event.target.dataset.row;
  return id.toString();
}

function canCastleBeSettle(data: any) {
  if (data !== 1) {
    return false;
  }
  return true;
}

function isMyArmy(position: { x: number; y: number }, myArmyPositions: any[]) {
  if (myArmyPositions) {
    return myArmyPositions.some((data: any) => {
      return (
        data.position.x.toString() === position.x &&
        data.position.y.toString() === position.y
      );
    });
  }
  return false;
}

function canArmyBeSettle(position: { x: number; y: number }) {
  const positions = [
    { x: position.x + 1, y: position.y },
    { x: position.x + 1, y: position.y + 1 },
    { x: position.x + 1, y: position.y + 2 },
    { x: position.x + 1, y: position.y - 1 },
    { x: position.x + 1, y: position.y - 2 },
    { x: position.x + 2, y: position.y },
    { x: position.x + 2, y: position.y + 1 },
    { x: position.x + 2, y: position.y - 1 },
    { x: position.x + 3, y: position.y },
    { x: position.x - 1, y: position.y },
    { x: position.x - 1, y: position.y + 1 },
    { x: position.x - 1, y: position.y + 2 },
    { x: position.x - 1, y: position.y - 2 },
    { x: position.x - 1, y: position.y - 1 },
    { x: position.x - 2, y: position.y },
    { x: position.x - 2, y: position.y + 1 },
    { x: position.x - 2, y: position.y - 1 },
    { x: position.x - 3, y: position.y },
    { x: position.x, y: position.y + 1 },
    { x: position.x, y: position.y + 2 },
    { x: position.x, y: position.y + 3 },
    { x: position.x, y: position.y - 3 },
    { x: position.x, y: position.y - 2 },
    { x: position.x, y: position.y - 1 },
  ];

  return positions;
}

function getMovingArmyId(position: { x: any; y: any }) {
  //Buradan istek yolla
}

export function Grid(data: DataProp) {
  const width = data.width;
  const height = data.height;
  const values = data.values;
  const rows = Array.from({ length: height }, (v, i) => i);
  const columns = Array.from({ length: width }, (v, i) => i);

  const {
    setMovingArmyId,
    movingArmyId,
    setIsArmyMoveStage,
    isArmyMoveStage,
    toArmyPosition,
    setToArmyPosition,
    fromArmyPosition,
    setFromArmyPosition,
    isCastleSettled,
    setTempCastle,
    setIsCastleSettled,
    isArmyStage,
    setArmyPosition,
    setNumberOfArmy,
    numberOfArmy,
  } = useTerrain();
  const [tempArmyPos, setTempArmyPos] = useState<any>();

  const castlePositions = useCastlePositions();
  const burnerWallets = useBurnerWallets();
  const myCastlePosition = useCastlePositionByAddress(
    getBurnerWallet().address.toLocaleLowerCase()
  );
  const armyPositions: any = useArmyPositions();
  const myArmyPosition: any = useUserArmy(
    getBurnerWallet().address.toLocaleLowerCase()
  )[0];
  const myArmyNumber = useUserArmy(
    getBurnerWallet().address.toLocaleLowerCase()
  )[1];

  // Handle Clicks
  const handleClick = (e: any) => {
    if (!isCastleSettled) {
      setTempCastle({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    if (isArmyStage) {
      setArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    if (
      !fromArmyPosition &&
      isCastleSettled &&
      !isArmyStage &&
      myArmyPosition &&
      isMyArmy({ x: getDataAtrX(e), y: getDataAtrY(e) }, myArmyPosition)
    ) {
      setFromArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setTempArmyPos({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setIsArmyMoveStage(true);
    } else if (
      fromArmyPosition &&
      canArmyBeSettle(fromArmyPosition).some(
        (item) =>
          item.x.toString() === getDataAtrX(e) &&
          item.y.toString() === getDataAtrY(e)
      )
    ) {
      setToArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setMovingArmyId(
        getMovingArmyId({ x: fromArmyPosition.x, y: fromArmyPosition.y })
      ); // Mock data
      setIsArmyMoveStage(false);
      if (isArmyMoveStage) {
        console.log("x");
        console.log(fromArmyPosition.x);
        console.log(fromArmyPosition.y);
        // toArmyPosition, movingArmyId kullanrak istek atabilirisin
      }
    } else {
      setFromArmyPosition(undefined);
      setIsArmyMoveStage(false);
    }
  };

  // Check if castle settled before and deploy castle emojis
  useEffect(() => {
    //Checks that if the user has already settled the castle
    if (castlePositions) {
      burnerWallets.map((wallet) => {
        if (
          wallet.value.toLocaleLowerCase() ===
          getBurnerWallet().address.toLocaleLowerCase()
        ) {
          if (myCastlePosition) {
            document.getElementById(
              `${myCastlePosition.y}${myCastlePosition.x}`
            )!.style.border = "2px solid rgb(245, 169, 6)";
          }
          setIsCastleSettled(true);
        }
      });

      //Puts the castle emojis to castle positions
      castlePositions.map(
        (data) =>
          (document.getElementById(`${data.y}${data.x}`)!.innerHTML = "🏰")
      );
    }
  }, [castlePositions]);

  useEffect(() => {
    //Makes castle position unClickable to not cause bug during army settlement
    if (castlePositions) {
      castlePositions.map((data) => {
        document
          .getElementById(`${data.y}${data.x}`)!
          .setAttribute("data-bs-toggle", "");
      });
    }
  }, [isArmyStage]);

  // Deploy army emojis to position. Add border for user's army.
  useEffect(() => {
    if (myArmyPosition) {
      myArmyPosition.map((data: any) => {
        const element = document.getElementById(
          `${data.position.y}${data.position.x}`
        )!;
        element.style.border = "2px solid rgb(245, 169, 6)";
      });
    }

    if (myArmyNumber) {
      setNumberOfArmy(myArmyNumber);
    }

    //Puts the castle emojis to castle positions
    armyPositions.map((data: any) => {
      document.getElementById(`${data.y}${data.x}`)!.innerHTML = "⚔️";
    });
  }, [armyPositions]);

  //Blue hover effect when user moves an army
  useEffect(() => {
    if (fromArmyPosition && isArmyMoveStage) {
      canArmyBeSettle({
        x: parseInt(fromArmyPosition.x),
        y: parseInt(fromArmyPosition.y),
      }).map((data: any) => {
        document
          .getElementById(`${data.y}${data.x}`)
          ?.classList.add("borderHoverMove");
      });
    } else {
      if (tempArmyPos) {
        canArmyBeSettle({
          x: parseInt(tempArmyPos.x),
          y: parseInt(tempArmyPos.y),
        }).map((data: any) => {
          document
            .getElementById(`${data.y}${data.x}`)
            ?.classList.remove("borderHoverMove");
        });
      }
    }
  }, [fromArmyPosition, isArmyMoveStage]);

  //Orange hover effect when user deploys an army
  useEffect(() => {
    if (isArmyStage && myCastlePosition) {
      canArmyBeSettle(myCastlePosition).map((data: any) =>
        document
          .getElementById(`${data.y}${data.x}`)
          ?.classList.add("borderHoverArmy")
      );
    } else if (!isArmyStage && myCastlePosition) {
      canArmyBeSettle(myCastlePosition).map((data: any) =>
        document
          .getElementById(`${data.y}${data.x}`)
          ?.classList.remove("borderHoverArmy")
      );
    }
  }, [isArmyStage]);

  return (
    <div className={`inline-grid ${data.isBorder && "border-4 border-black"}`}>
      {rows.map((row) => {
        return columns.map((column) => {
          return (
            <div
              key={`${column},${row}`}
              id={`${row}${column}`}
              data-row={`${row}`}
              data-column={`${column}`}
              style={{
                gridColumn: column + 1,
                gridRow: row + 1,
                width: `${data.pixelStyles[1]}px`,
                height: `${data.pixelStyles[1]}px`,
                backgroundImage: `${bgImg(values[row][column])}`,
                backgroundSize: "cover",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: `${data.isBorder && "3.5px"}`,
              }}
              onClick={(e) => {
                handleClick(e);
              }}
              className={`
                ${!data.isBorder &&
                canCastleBeSettle(values[row][column]) &&
                "borderHover"
                }`}
              data-bs-toggle={`${canCastleBeSettle(values[row][column]) &&
                  !isCastleSettled &&
                  !data.isBorder
                  ? "modal"
                  : ""
                }${canCastleBeSettle(values[row][column]) &&
                  isCastleSettled &&
                  !data.isBorder &&
                  isArmyStage &&
                  numberOfArmy !== 3 &&
                  canArmyBeSettle(myCastlePosition).some(
                    (item) => item.x === column && item.y === row
                  )
                  ? "modal"
                  : ""
                }`}
              data-bs-target={`${canCastleBeSettle(values[row][column]) &&
                  !isCastleSettled &&
                  !data.isBorder
                  ? "#castleSettleModal"
                  : ""
                }${canCastleBeSettle(values[row][column]) &&
                  isCastleSettled &&
                  !data.isBorder &&
                  isArmyStage &&
                  numberOfArmy !== 3 &&
                  canArmyBeSettle(myCastlePosition).some(
                    (item) => item.x === column && item.y === row
                  )
                  ? "#armySettleModal"
                  : ""
                }`}
            ></div>
          );
        });
      })}
      <CastleSettleModal></CastleSettleModal>
      <ArmySettleModal></ArmySettleModal>
    </div>
  );
}
