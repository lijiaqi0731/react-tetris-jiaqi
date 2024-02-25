import { useCallback, useState } from "react";
import { checkCollision, STAGE_WIDTH } from "../gameHelpers";

import { randomTetromino, TETROMINOS } from "../tetrominos";

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: {x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false,
    })

    const rotate = (matrix, dir) => {
        // make the rows to become cols(transpose)
        const rotateTetro = matrix[0].map((_, index) => 
            matrix.map(col => col[index]),
        );
        // reverse wach row to get a rotate matrix
        if (dir > 0) return rotateTetro.map(row => row.reverse());
        return rotateTetro.reverse();
    }

    const playerRotate = (stage, dir) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, stage, {x: 0, y: 0})) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }

        setPlayer(clonedPlayer);
    }

    const updatePlayerPos = ({x, y, collided}) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
            collided: collided
        }))
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: {x: STAGE_WIDTH / 2 - 2, y: 0},
            tetromino: randomTetromino().shape,
            collided: false,
        })
    })

    return [player, updatePlayerPos, resetPlayer, playerRotate];

}