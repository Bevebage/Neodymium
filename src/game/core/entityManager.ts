import { Entity, MAX_ENTITIES, Signature } from "./types_consts";

export class EntityManager {
  private freeEntities: Array<Entity>
  private signatures: Array<Signature>
  private busyEntityCount: number

  constructor() {
    this.freeEntities = Array.from(Array(MAX_ENTITIES).keys())
    this.signatures = Array(MAX_ENTITIES).fill(new Signature())
    this.busyEntityCount = 0
  }

  createEntity(): Entity {
    if (this.busyEntityCount < MAX_ENTITIES) {
      this.busyEntityCount += 1
      return this.freeEntities.shift()!
    } else {
      throw new Error('Maximum number of entities spawned')
    }
  }

  destroyEntity(entity: Entity): void {
    if ((0 <= entity) && (entity < MAX_ENTITIES)) {
      this.signatures[entity].reset()
      this.freeEntities.push(entity)
      this.busyEntityCount -= 1
    } else {
      throw new Error('Entity id is out of bounds')
    }
  }

  setSignature(entity: Entity, signature: Signature): void {
    if ((0 <= entity) && (entity < MAX_ENTITIES)) {
      this.signatures[entity] = signature
    } else {
      throw new Error('Entity id is out of bounds')
    }
  }

  getSignature(entity: Entity): Signature {
    if ((0 <= entity) && (entity < MAX_ENTITIES)) {
      return this.signatures[entity]
    } else {
      throw new Error('Entity id is out of bounds')
    }
  }
}