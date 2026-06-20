import { type Hex, hexKey } from "./coordinates"

export const TileType = {
    Normal: "normal",
    Fragment: "fragment",
    Blocked: "blocked"
} as const

export type TileType = (typeof TileType)[keyof typeof TileType]

export interface Tile {
    hex: Hex
    col: number
    row: number
    type: TileType
    fragmentValue?: number
}

export interface HexGrid{
    tiles: Map<string, Tile>
    rows: number
    cols: number            // current total width, grows over time
    exitCol: number         // always 0
    entranceCol: number     // pushed outward each wave
}

const FRAGMENT_RATIO = 0.1
const BLOCKED_RATIO = 0.1
const FRAGMENT_VALUE = 5 // placeholder, tune later
export const COLUMNS_PER_WAVE = 1

export function generateGrid(initialCols: number, rows: number): HexGrid {
    const tiles = new Map<string, Tile>()
    const exitCol = 0
    const entranceCol = initialCols - 1

    for(let col = 0; col < initialCols; col++){
        
        generateColumn(tiles, col, rows, col === exitCol || col === entranceCol)

    }

    return { tiles, rows, cols: initialCols, exitCol, entranceCol}

}

export function addColumns(grid: HexGrid, count: number = COLUMNS_PER_WAVE): void {

    const startCol = grid.entranceCol + 1
    const newEntranceCol = grid.entranceCol + count

    for(let col = startCol; col <= newEntranceCol; col++){

        generateColumn(grid.tiles, col, grid.rows, col === newEntranceCol)

    }

    grid.entranceCol = newEntranceCol
    grid.cols = newEntranceCol + 1

}

function generateColumn(tiles: Map<string, Tile>, col: number, rows: number, plain: boolean){

    for(let row = 0; row < rows; row++){

        const hex = colRowToAxial(col, row)
        const tile: Tile = { hex, col, row, type: TileType.Normal }

        if(!plain){

            const roll = Math.random()
            if(roll < FRAGMENT_RATIO){

                tile.type = TileType.Fragment
                tile.fragmentValue = FRAGMENT_VALUE

            } else if(roll < FRAGMENT_RATIO + BLOCKED_RATIO){

                tile.type = TileType.Blocked

            }

        }

        tiles.set(hexKey(hex), tile)

    }
    
}

// Odd-r offset layout converted to axial
function colRowToAxial(col: number, row: number): Hex {
    const rOffset = Math.floor(row / 2)
    return { q: col - rOffset, r: row }
}

function shuffle<T>(arr: T[]): void {
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
}

export function getTile(grid: HexGrid, hex: Hex): Tile | undefined {
    return grid.tiles.get(hexKey(hex))
}

export function getColumnTiles(grid: HexGrid, col: number): Tile[] {
    return Array.from(grid.tiles.values()).filter((t) => t.col === col)
}