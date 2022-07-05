import { BaseComponent, Entity, MAX_ENTITIES } from './types_consts'

export class ComponentArray<ComponentType extends BaseComponent> {
  private componentArray: Array<ComponentType>
  private entityToIndex: {
    [key: Entity]: number
  }
  private indexToEntity: {
    [key: number]: Entity
  }
  private size: number

  constructor() {
    this.componentArray = new Array(MAX_ENTITIES)
    this.entityToIndex = {}
    this.indexToEntity = {}
    this.size = 0
    console.log(this.componentArray)
  }

  insertData(entity: Entity, component: ComponentType): void {
    if (!(entity in this.entityToIndex)) {
      this.entityToIndex[entity] = this.size
      this.indexToEntity[this.size] = entity
      this.componentArray[this.size] = component
      this.size += 1
    } else {
      throw new Error('Entity already exists in ComponentArray')
    }
  }

  removeData(entity: Entity): void {
    if (entity in this.entityToIndex) {
      let removedEntityIndex: number = this.entityToIndex[entity]
      let lastEntityIndex: number = this.size - 1
      this.componentArray[removedEntityIndex] = this.componentArray[lastEntityIndex]

      let lastEntityEntity: Entity = this.indexToEntity[lastEntityIndex]
      this.entityToIndex[lastEntityEntity] = removedEntityIndex
      this.indexToEntity[removedEntityIndex] = lastEntityEntity

      delete this.entityToIndex[entity]
      delete this.indexToEntity[lastEntityIndex]
      delete this.componentArray[lastEntityIndex]

      this.size -= 1
    } else {
      throw new Error('Entity does not exist in ComponentArray')
    }
  }

  getData(entity: Entity): ComponentType {
    if (entity in this.entityToIndex) {
      return this.componentArray[this.entityToIndex[entity]]
    } else {
      throw new Error('Entity does not exist in ComponentArray')
    }
  }

  entityDestroyed(entity: Entity): void {
    if (entity in this.entityToIndex) {
      this.removeData(entity)
    }
  }
}

let C = new ComponentArray()