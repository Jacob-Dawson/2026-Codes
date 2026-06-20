// Axial coordinate system for a pointy-top hex grid.
// Pointy-top is used because E/W are direct neighbours, which suits our left to right enemy flow (entry right, exit left)

export interface Hex {
    q: number
    r: number
}

export interface CubeHex {
    x: number
    y: number
    z: number
}

// Six neighbour directions, order: E, NE, NW, W, SW, SE
export const HEX_DIRECTIONS: Hex[] = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 }
]

export function hexAdd(a: Hex, b: Hex): Hex {
    return { q: a.q + b.q, r: a.r + b.r }
}

export function hexEquals(a: Hex, b: Hex): boolean {
    return a.q === b.q && a.r == b.r
}

// Objects with equal q/r aren't === equal in JS, so use this as the key for Map / Set lookups
export function hexKey(hex: Hex): string {
    return `${hex.q},${hex.r}`
}

export function hexNeighbor(hex: Hex, direction: number): Hex {
    return hexAdd(hex, HEX_DIRECTIONS[direction])
}

export function hexNeighbors(hex: Hex): Hex[] {
    return HEX_DIRECTIONS.map((dir) => hexAdd(hex, dir))
}

function axialToCube(hex: Hex): CubeHex {
    const x = hex.q
    const z = hex.r
    const y = -x - z
    return { x, y, z}
}

function cubeToAxial(cube: CubeHex): Hex {
    return { q: cube.x, r: cube.z }
}

export function hexDistance(a: Hex, b: Hex): number {
    const ac = axialToCube(a)
    const bc = axialToCube(b)
    return Math.max(
        Math.abs(ac.x - bc.x),
        Math.abs(ac.y - bc.y),
        Math.abs(ac.z - bc.z)
    )
}

// Pixel conversion (pointy-top), size = center-to-corner distance

export function hexToPixel(hex: Hex, size: number): { x: number; y: number}{
    const x = size * (Math.sqrt(3) * hex.q + (Math.sqrt(3) / 2) * hex.r)
    const y = size * ((3 / 2) * hex.r)
    return {x, y}
}

export function pixelToHex(point: { x: number; y: number}, size: number): Hex {
    const q = ((Math.sqrt(3) / 3) * point.x - (1 / 3) * point.y) / size
    const r = ((2 / 3) * point.y) / size
    return hexRound({q, r})
}

// Rounds fractional axial coords (from pixelToHex) to the nearest real hex, by rounding in cube space and fixing the worst-error axis
function hexRound(hex: Hex): Hex {
    const cube = axialToCube(hex)
    let rx = Math.round(cube.x)
    let ry = Math.round(cube.y)
    let rz = Math.round(cube.z)

    const xDiff = Math.abs(rx - cube.x)
    const yDiff = Math.abs(ry - cube.y)
    const zDiff = Math.abs(rz - cube.z)

    if(xDiff > yDiff && xDiff > zDiff) rx = -ry - rz
    else if (yDiff > zDiff) ry = -rx - rz
    else rz = -rx - ry

    return cubeToAxial({ x: rx, y: ry, z: rz })
}

// Corner points for drawing a hex on canvas
export function hexCorners(center: {x: number; y: number}, size: number) {
    const corners: { x: number; y: number}[] = []
    for(let i = 0; i < 6; i++){
        const angle = (Math.PI / 180) * (60 * i - 90)
        corners.push({
            x: center.x + size * Math.cos(angle),
            y: center.y + size * Math.sin(angle)
        })
    }
    return corners
}