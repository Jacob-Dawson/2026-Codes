import { type HexGrid, type Tile, TileType } from "../game/hex/grid";
import { hexToPixel, hexCorners } from "../game/hex/coordinates";
import { type Path } from "../game/hex/path"
import { HEX_SIZE } from "./constants";

const TILE_COLORS: Record<string, string> = {
    [TileType.Normal]: "#1c1c1e",
    [TileType.Fragment]: "#3a8f6b",
    [TileType.Blocked]: "#4a4a4a"
}

const TILE_STROKE = "#3a3a3c"
const ENTRANCE_STROKE = "#c0392b"
const EXIT_STROKE = "#2e86de"
const PATH_COLOR = "#f4c542"

export function renderGrid(
    ctx: CanvasRenderingContext2D,
    grid: HexGrid,
    offset: { x: number; y: number }
) {
    ctx.save()
    ctx.translate(offset.x, offset.y)

    const specialTiles: Tile[] = []

    for(const tile of grid.tiles.values()){
        if(tile.col === grid.entranceCol || tile.col === grid.exitCol){

            specialTiles.push(tile)
            continue

        }
        drawTile(ctx, tile, grid)
    }

    // Drawn last so their colored outline never gets overwritten by an adjacent column's stroke
    for(const tile of specialTiles){

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

    ctx.fillStyle = TILE_COLORS[tile.type]
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

export function renderPath(
    ctx: CanvasRenderingContext2D,
    path: Path,
    offset: { x: number; y: number }
) {

    if(path.hexes.length === 0) return

    ctx.save()
    ctx.translate(offset.x, offset.y)

    ctx.beginPath()
    path.hexes.forEach((hex, i) => {
        const center = hexToPixel(hex, HEX_SIZE)
        if(i === 0) ctx.moveTo(center.x, center.y)
        else ctx.lineTo(center.x, center.y)
    })

    ctx.strokeStyle = PATH_COLOR
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    const last = path.hexes[path.hexes.length - 1]
    const lastCenter = hexToPixel(last, HEX_SIZE)
    ctx.beginPath()
    ctx.arc(lastCenter.x, lastCenter.y, 6, 0, Math.PI * 2)
    ctx.fillStyle = PATH_COLOR
    ctx.fill()

    ctx.restore()

}