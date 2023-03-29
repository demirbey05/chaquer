import { useTerrain } from "../../context/TerrainContext";

function CastleSettleModal() {
    const { handleTileClick } = useTerrain(); 
    
    return (
        <>
        <div className="modal" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Castle Settlement</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                You are going to settle your Castle, are you sure?
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary bg-dark" data-bs-dismiss="modal">No</button>
                <button onClick={() => {
                handleTileClick();
                }} type="button" className="btn btn-primary bg-dark" data-bs-dismiss="modal">Yes</button>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}

export default CastleSettleModal
