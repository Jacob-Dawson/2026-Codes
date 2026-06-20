import { type HexGrid, type Tile, TileType } from "../game/hex/grid";
import { hexToPixel, hexCorners } from "../game/hex/coordinates";

const HEX_SIZE = 32 // center to corner distance in pixels
const TILE_COLOURS: Record<string, string> = {
    [TileType.Normal]: "#1c1c1e",
    [TileType.Fragment]: "#3a8f6b",
    [TileType.Blocked]: "#4a4a4a"
}

const TILE_STROKE = "#3a3a3c"
const ENTRANCE_STROKE = "#c0392b"
const EXIT_STROKE = "#2e86de"

export function renderGrid(
    ctx: CanvasRenderingContext2D,
    grid: HexGrid,
    offset: { x: number; y: number }
) {
    ctx.save()
    ctx.translate(offset.x, offset.y)

    for(const tile of grid.tiles.values()){
        drawTile(ctx, tile, grid)
    }

    ctx.restore()
}

function drawTile(ctx: CanvasRenderingContext2D, tile: Tile, grid: HexGrid){

    const center = hexToPixel(tile.hex, HEX_SIZE)
    const corners = hexCorners(center, HEX_SIZE)

    ctx.beginPath()
    corners.forEach((point, i) => {
        if(i === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
    })
    ctx.closePath()

    ctx.fillStyle = TILE_COLOURS[tile.type]
    ctx.fill()

    let strokeColor = TILE_STROKE
    let lineWidth = 1
    if(tile.col === grid.entranceCol){
        strokeColor = ENTRANCE_STROKE
        lineWidth = 2
    } else if (tile.col === grid.exitCol){
        strokeColor = EXIT_STROKE
        lineWidth = 2
    }

    ctx.strokeStyle = strokeColor
    ctx.lineWidth = lineWidth
    ctx.stroke()

}