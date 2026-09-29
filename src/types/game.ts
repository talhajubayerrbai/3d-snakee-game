export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface Point {
  x: number
  y: number
}

export interface GameState {
  snake: Point[]
  food: Point
  direction: Direction
  score: number
  gameOver: boolean
  running: boolean
}
