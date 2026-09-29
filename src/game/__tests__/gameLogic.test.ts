import { describe, it, expect, beforeEach } from 'vitest'
import {
  createInitialState,
  getNextHead,
  checkWallCollision,
  checkSelfCollision,
  stepGame,
  isOppositeDirection,
  GRID_SIZE,
} from '../gameLogic'
import { GameState, Point } from '../../types/game'

describe('getNextHead — movement', () => {
  it('moves UP correctly', () => {
    expect(getNextHead([{ x: 5, y: 5 }], 'UP')).toEqual({ x: 5, y: 4 })
  })
  it('moves DOWN correctly', () => {
    expect(getNextHead([{ x: 5, y: 5 }], 'DOWN')).toEqual({ x: 5, y: 6 })
  })
  it('moves LEFT correctly', () => {
    expect(getNextHead([{ x: 5, y: 5 }], 'LEFT')).toEqual({ x: 4, y: 5 })
  })
  it('moves RIGHT correctly', () => {
    expect(getNextHead([{ x: 5, y: 5 }], 'RIGHT')).toEqual({ x: 6, y: 5 })
  })
})

describe('checkWallCollision', () => {
  it('detects left wall', () => {
    expect(checkWallCollision({ x: -1, y: 5 })).toBe(true)
  })
  it('detects right wall', () => {
    expect(checkWallCollision({ x: GRID_SIZE, y: 5 })).toBe(true)
  })
  it('detects top wall', () => {
    expect(checkWallCollision({ x: 5, y: -1 })).toBe(true)
  })
  it('detects bottom wall', () => {
    expect(checkWallCollision({ x: 5, y: GRID_SIZE })).toBe(true)
  })
  it('does not flag valid interior point', () => {
    expect(checkWallCollision({ x: 10, y: 10 })).toBe(false)
  })
  it('does not flag top-left corner', () => {
    expect(checkWallCollision({ x: 0, y: 0 })).toBe(false)
  })
  it('does not flag bottom-right corner', () => {
    expect(checkWallCollision({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 })).toBe(false)
  })
})

describe('checkSelfCollision', () => {
  const body: Point[] = [
    { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 },
  ]
  it('detects head hitting body', () => {
    expect(checkSelfCollision({ x: 8, y: 10 }, body)).toBe(true)
  })
  it('returns false when head is clear', () => {
    expect(checkSelfCollision({ x: 10, y: 10 }, body)).toBe(false)
  })
})

describe('isOppositeDirection', () => {
  it('UP and DOWN are opposite', () => expect(isOppositeDirection('UP', 'DOWN')).toBe(true))
  it('DOWN and UP are opposite', () => expect(isOppositeDirection('DOWN', 'UP')).toBe(true))
  it('LEFT and RIGHT are opposite', () => expect(isOppositeDirection('LEFT', 'RIGHT')).toBe(true))
  it('RIGHT and LEFT are opposite', () => expect(isOppositeDirection('RIGHT', 'LEFT')).toBe(true))
  it('RIGHT and UP are not opposite', () => expect(isOppositeDirection('RIGHT', 'UP')).toBe(false))
})

describe('stepGame', () => {
  let state: GameState

  beforeEach(() => {
    state = {
      ...createInitialState(),
      running: true,
      // snake: [{x:10,y:10},{x:9,y:10},{x:8,y:10}], direction: RIGHT, food: {x:15,y:10}
    }
  })

  it('advances snake head in the current direction', () => {
    const next = stepGame(state)
    expect(next.snake[0]).toEqual({ x: 11, y: 10 })
  })

  it('tail is removed when no food eaten', () => {
    const next = stepGame(state)
    expect(next.snake).toHaveLength(3)
  })

  it('sets gameOver on wall collision', () => {
    // Drive snake into right wall
    let s = { ...state, snake: [{ x: GRID_SIZE - 1, y: 10 }, { x: GRID_SIZE - 2, y: 10 }], direction: 'RIGHT' as const }
    const next = stepGame(s)
    expect(next.gameOver).toBe(true)
  })

  it('sets gameOver on self collision', () => {
    const s: GameState = {
      ...state,
      snake: [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 6, y: 6 },
        { x: 6, y: 5 },
      ],
      direction: 'DOWN',
    }
    // next head = {x:5, y:6} which is in body
    const next = stepGame(s)
    expect(next.gameOver).toBe(true)
  })

  it('increments score by 10 when food is eaten', () => {
    const s: GameState = {
      ...state,
      snake: [{ x: 14, y: 10 }, { x: 13, y: 10 }],
      food: { x: 15, y: 10 },
      direction: 'RIGHT',
      score: 0,
    }
    const next = stepGame(s)
    expect(next.score).toBe(10)
  })

  it('snake grows when food is eaten', () => {
    const s: GameState = {
      ...state,
      snake: [{ x: 14, y: 10 }, { x: 13, y: 10 }],
      food: { x: 15, y: 10 },
      direction: 'RIGHT',
      score: 0,
    }
    const next = stepGame(s)
    expect(next.snake).toHaveLength(3)
  })

  it('does not step when gameOver', () => {
    const s = { ...state, gameOver: true }
    const next = stepGame(s)
    expect(next).toBe(s)
  })

  it('does not step when not running', () => {
    const s = { ...state, running: false }
    const next = stepGame(s)
    expect(next).toBe(s)
  })
})
