import { useTerrain } from "../../context/TerrainContext";
import { useMUD } from "../../MUDContext";
import { Button } from "@chakra-ui/react";

function CastleSettleModal() {
  const { isCastleSettled, tempCastle, setCastle, setIsCastleSettled, setIsCastleDeployedBefore } = useTerrain();
  const { systems } = useMUD();

  const handleClick = async () => {
    const tx =
      !isCastleSettled &&
      (await systems["system.CastleSettle"].executeTyped(
        tempCastle.x,
        tempCastle.y
      ));
    setIsCastleSettled(true);
    if (tx) {
      setCastle({ x: tempCastle.x, y: tempCastle.y });
      const tc = await tx.wait();
      setIsCastleDeployedBefore(true)
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="castleSettleModal"
        data-bs-backdrop="static"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Castle Settlement
              </h1>
            </div>
            <div className="modal-body">
              You are going to settle your Castle, are you sure?
            </div>
            <div className="modal-footer">
              <Button
                colorScheme="whatsapp"
                border="solid"
                textColor="dark"
                data-bs-dismiss="modal"
                onClick={() => handleClick()}
              >
                Settle Castle
              </Button>
              <Button
                colorScheme="red"
                border="solid"
                textColor="dark"
                data-bs-dismiss="modal"
              >
                Back to Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CastleSettleModal;
