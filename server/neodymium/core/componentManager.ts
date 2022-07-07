import { ComponentArray } from "./componentArray";
import { BaseComponent, ComponentConstructor, ComponentIndex, Entity } from "./types_consts";

export class ComponentManager {
  private componentIndices: {
    [key: string]: ComponentIndex
  }
  private componentArrays: {
    [key: string]: ComponentArray<BaseComponent>
  }
  private nextComponentIndex: ComponentIndex

  constructor() {
    this.componentIndices = {}
    this.componentArrays = {}
    this.nextComponentIndex = 0
  }

  private getComponentName(X: ComponentConstructor | BaseComponent): string {
   if (X instanceof BaseComponent) {
    return X.constructor.name
   } else {
    return X.name
   }
  }

  private getComponentArray(X: ComponentConstructor | BaseComponent): ComponentArray<BaseComponent> {
    let typeName: string = this.getComponentName(X)
    if (typeName in this.componentIndices) {
      return this.componentArrays[typeName]
    } else {
      throw new Error('Component not registered before use')
    }
  }

  registerComponent<ComponentType extends BaseComponent>(C: ComponentConstructor): void {
    let typeName: string = C.name
    if (!(typeName in this.componentIndices)) {
      this.componentIndices[typeName] = this.nextComponentIndex
      this.componentArrays[typeName] = new ComponentArray<ComponentType>()
      this.nextComponentIndex += 1
    } else {
      throw new Error('Component already registered')
    }
  }

  getComponentIndex(X: ComponentConstructor | BaseComponent): ComponentIndex {
    let typeName: string = this.getComponentName(X)
    if (typeName in this.componentIndices) {
      return this.componentIndices[typeName]
    } else {
      throw new Error('Component not registered before use')
    }
  }

  addComponent(entity: Entity, component: BaseComponent): void {
    this.getComponentArray(component).insertData(entity, component)
  }

  removeComponent(entity: Entity, X: ComponentConstructor | BaseComponent): void {
    this.getComponentArray(X).removeData(entity)
  }

  getComponent<ComponentType extends BaseComponent>(entity: Entity, C: ComponentConstructor): ComponentType {
    return <ComponentType>this.getComponentArray(C).getData(entity)
  }

  entityDestroyed(entity: Entity): void {
    for (let componentArray of Object.values(this.componentArrays)) {
      componentArray.entityDestroyed(entity)
    }
  }
}