import { type Hex, hexEquals, hexKey, hexNeighbors } from "./coordinates"
import { type HexGrid, TileType, getTile } from "./grid"

export interface Path {
    hexes: Hex[] // ordered, entry -> exit
}

export function createPath(startHex: Hex): Path{
    return {hexes: [startHex]}
}

export function canExtendTo(grid: HexGrid, path: Path, candidate: Hex): boolean {
    const last = path.hexes[path.hexes.length - 1]
    const isNeighbor = hexNeighbors(last).some((n) => hexEquals(n, candidate))
    if(!isNeighbor) return false

    const alreadyUsed = path.hexes.some((h) => hexEquals(h, candidate))
    if(alreadyUsed) return false

    const tile = getTile(grid, candidate)
    if(!tile || tile.type === TileType.Blocked) return false

    return true
}

export function extendTo(path: Path, candidate: Hex): Path {
    return { hexes: [...path.hexes, candidate]}
}

// Has the path reached the current entrance column?
export function isComplete(grid: HexGrid, path: Path): boolean {
    const last = path.hexes[path.hexes.length - 1]
    return getTile(grid, last)?.col === grid.entranceCol
}

export function isValidPath(grid: HexGrid, path: Path): boolean {
    if(path.hexes.length === 0) return false

    const firstTile = getTile(grid, path.hexes[0])
    if(!firstTile || firstTile.col !== grid.exitCol) return false

    const seen = new Set<string>()
    for(let i = 0; i < path.hexes.length; i++){

        const hex = path.hexes[i]
        const key = hexKey(hex)
        if(seen.has(key)) return false
        seen.add(key)

        const tile = getTile(grid, hex)
        if(!tile || tile.type === TileType.Blocked) return false

        if(i > 0){
            const isNeighbor = hexNeighbors(path.hexes[i - 1]).some((n) => hexEquals(n, hex))
            if(!isNeighbor) return false
        }

    }

    return isComplete(grid, path)
}

export function collectFragments(grid: HexGrid, path: Path): number {
    return path.hexes.reduce((total, hex) => {
        const tile = getTile(grid, hex)
        return tile?.type === TileType.Fragment ? total + (tile.fragmentValue ?? 0) : total

    }, 0)
}

// True once grid.addColumns() has run and the path no longer reaches the entrance
export function needsExtension(grid: HexGrid, path: Path): boolean {
    return !isComplete(grid, path)
}