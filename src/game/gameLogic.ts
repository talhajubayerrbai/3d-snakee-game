import { Direction, GameState, Point } from '../types/game'

export const GRID_SIZE = 20

export function createInitialState(): GameState {
  return {
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    food: { x: 15, y: 10 },
    direction: 'RIGHT',
    score: 0,
    gameOver: false,
    running: false,
  }
}

export function getNextHead(snake: Point[], direction: Direction): Point {
  const head = snake[0]
  switch (direction) {
    case 'UP':    return { x: head.x, y: head.y - 1 }
    case 'DOWN':  return { x: head.x, y: head.y + 1 }
    case 'LEFT':  return { x: head.x - 1, y: head.y }
    case 'RIGHT': return { x: head.x + 1, y: head.y }
  }
}

export function checkWallCollision(point: Point): boolean {
  return (
    point.x < 0 ||
    point.x >= GRID_SIZE ||
    point.y < 0 ||
    point.y >= GRID_SIZE
  )
}

export function checkSelfCollision(head: Point, body: Point[]): boolean {
  return body.some(segment => segment.x === head.x && segment.y === head.y)
}

export function spawnFood(snake: Point[]): Point {
  let food: Point
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some(s => s.x === food.x && s.y === food.y))
  return food
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  return (
    (current === 'UP'    && next === 'DOWN')  ||
    (current === 'DOWN'  && next === 'UP')    ||
    (current === 'LEFT'  && next === 'RIGHT') ||
    (current === 'RIGHT' && next === 'LEFT')
  )
}

export function stepGame(state: GameState): GameState {
  if (state.gameOver || !state.running) return state

  const nextHead = getNextHead(state.snake, state.direction)

  if (checkWallCollision(nextHead) || checkSelfCollision(nextHead, state.snake)) {
    return { ...state, gameOver: true, running: false }
  }

  const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y
  const newSnake = ateFood
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, -1)]

  return {
    ...state,
    snake: newSnake,
    food: ateFood ? spawnFood(newSnake) : state.food,
    score: ateFood ? state.score + 10 : state.score,
  }
}
