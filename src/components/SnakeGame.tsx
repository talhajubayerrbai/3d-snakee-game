import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GameState, Direction } from '../types/game'
import {
  createInitialState,
  isOppositeDirection,
  stepGame,
  GRID_SIZE,
} from '../game/gameLogic'
import './SnakeGame.css'

const CELL_SIZE = 20
const TICK_MS = 150

export default function SnakeGame() {
  const [state, setState] = useState<GameState>(createInitialState)
  const dirRef = useRef<Direction>('RIGHT')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tick = useCallback(() => {
    setState(prev => {
      const next = stepGame({ ...prev, direction: dirRef.current })
      return next
    })
  }, [])

  const start = useCallback(() => {
    setState(prev => (prev.gameOver ? { ...createInitialState(), running: true } : { ...prev, running: true }))
    dirRef.current = 'RIGHT'
  }, [])

  useEffect(() => {
    if (state.running && !state.gameOver) {
      intervalRef.current = setInterval(tick, TICK_MS)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [state.running, state.gameOver, tick])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      }
      const next = map[e.key]
      if (next && !isOppositeDirection(dirRef.current, next)) {
        dirRef.current = next
        e.preventDefault()
      }
      if (e.key === ' ' || e.key === 'Enter') start()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [start])

  const canvasSize = GRID_SIZE * CELL_SIZE

  return (
    <div className="snake-game">
      <div className="hud">
        <span>Score: <strong>{state.score}</strong></span>
        {!state.running && !state.gameOver && (
          <button onClick={start}>Start</button>
        )}
        {state.gameOver && (
          <button onClick={start}>Restart</button>
        )}
      </div>
      <div
        className="board"
        style={{ width: canvasSize, height: canvasSize }}
        role="region"
        aria-label="snake game board"
      >
        {state.gameOver && (
          <div className="overlay">
            <p>Game Over</p>
            <p>Score: {state.score}</p>
          </div>
        )}
        {state.food && (
          <div
            className="food"
            style={{
              left: state.food.x * CELL_SIZE,
              top: state.food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        )}
        {state.snake.map((seg, i) => (
          <div
            key={i}
            className={i === 0 ? 'snake-head' : 'snake-body'}
            style={{
              left: seg.x * CELL_SIZE,
              top: seg.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))}
      </div>
      <p className="hint">Arrow keys / WASD to move · Space or Enter to start</p>
    </div>
  )
}
