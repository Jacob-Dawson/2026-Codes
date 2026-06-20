import { useEffect, useRef } from "react";
import { generateGrid, getTile, type HexGrid } from "../game/hex/grid";
import { createPath, canExtendTo, extendTo, type Path } from "../game/hex/path"
import { pixelToHex } from "../game/hex/coordinates";
import { renderGrid, renderPath } from "./renderer";
import { HEX_SIZE, GRID_OFFSET } from "./constants";

const INITIAL_COLS = 12
const INITIAL_ROWS = 8

export function GameCanvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const gridRef = useRef<HexGrid>(generateGrid(INITIAL_COLS, INITIAL_ROWS))
    const pathRef = useRef<Path | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if(!canvas) return
        const ctx = canvas.getContext("2d")
        if(!ctx) return

        let frameId: number

        function frame(){

            ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
            renderGrid(ctx!, gridRef.current, GRID_OFFSET)
            if(pathRef.current) renderPath(ctx!, pathRef.current, GRID_OFFSET)
            frameId = requestAnimationFrame(frame)

        }

        frameId = requestAnimationFrame(frame)
        return () => cancelAnimationFrame(frameId)
    }, [])

    function handleClick(event: React.MouseEvent<HTMLCanvasElement>){
        const canvas = canvasRef.current
        if(!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const x = (event.clientX - rect.left) * scaleX - GRID_OFFSET.x
        const y = (event.clientY - rect.top) * scaleY - GRID_OFFSET.y

        const hex = pixelToHex({x, y}, HEX_SIZE)
        const grid = gridRef.current
        const tile = getTile(grid, hex)
        if(!tile) return

        const currentPath = pathRef.current

        if(!currentPath){
            if(tile.col === grid.exitCol){

                pathRef.current = createPath(hex)

            }
            return
        }

        if(canExtendTo(grid, currentPath, hex)){

            pathRef.current = extendTo(currentPath, hex)

        }
    }

    return (
        <canvas
            ref={canvasRef}
            width={900}
            height={600}
            style={{ background: "#0a0a0c"}}
            onClick={handleClick}
        />
    )
}