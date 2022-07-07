import { Engine } from "./engine"

export type Entity = number
export const MAX_ENTITIES: number = 5000

export type ComponentIndex = number
export const MAX_COMPONENTS: number = 32
export abstract class BaseComponent {}
export type ComponentConstructor<T = BaseComponent> = {new(...args: any): T}

export abstract class BaseSystem {
  private engine
  constructor(engine: Engine) {
    this.engine = engine
  }
  entities: Set<Entity> = new Set<Entity>()
}
export type SystemConstructor<T = BaseSystem> = {new(...args: any): T}

export class Signature {
  private max_val: number
  private val: number

  constructor(val?: number) {
    this.val = val ?? 0
    this.max_val = 2 ** MAX_COMPONENTS - 1
  }

  static and(s1: Signature, s2: Signature): Signature {
    return new Signature(s1.val ^ s2.val)
  }

  static or(s1: Signature, s2: Signature): Signature {
    return new Signature(s1.val | s2.val)
  }

  static equals(s1: Signature, s2: Signature): boolean {
    return s1.val === s2.val
  }

  get(i: number): boolean {
    return (this.val & (1 << i)) === 1
  }

  set(key: number, value: boolean): void {
    if (value) {
      this.val |= 1 << key
    } else {
      this.val &= this.max_val - (1 << key)
    }
  }

  reset(): void {
    this.val = 0
  }
}