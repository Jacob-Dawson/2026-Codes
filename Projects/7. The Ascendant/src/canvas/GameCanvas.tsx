import { useEffect, useRef } from "react";
import { generateGrid, type HexGrid } from "../game/hex/grid";
import { renderGrid } from "./renderer";

const INITIAL_COLS = 12
const INITIAL_ROWS = 8

export function GameCanvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const gridRef = useRef<HexGrid>(generateGrid(INITIAL_COLS, INITIAL_ROWS))

    useEffect(() => {
        const canvas = canvasRef.current
        if(!canvas) return
        const ctx = canvas.getContext("2d")
        if(!ctx) return

        let frameId: number

        function frame(){

            ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
            renderGrid(ctx!, gridRef.current, { x: 60, y: 60})
            frameId = requestAnimationFrame(frame)

        }

        frameId = requestAnimationFrame(frame)
        return () => cancelAnimationFrame(frameId)
    }, [])

    return (
        <canvas
            ref={canvasRef}
            width={900}
            height={600}
            style={{ background: "#0a0a0c"}}
        />
    )
}