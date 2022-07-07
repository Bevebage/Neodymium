import { ComponentManager } from "./componentManager";
import { EntityManager } from "./entityManager";
import { SystemManager } from "./systemManger";
import { BaseComponent, BaseSystem, ComponentConstructor, ComponentIndex, Entity, MAX_COMPONENTS, Signature, SystemConstructor } from "./types_consts";

export class Engine {
  private entityManger: EntityManager
  private componentManager: ComponentManager
  private systemManger: SystemManager

  constructor() {
    this.entityManger = new EntityManager()
    this.componentManager = new ComponentManager()
    this.systemManger = new SystemManager(this)
  }

  createEntity(): Entity {
    return this.entityManger.createEntity() 
  }

  destroyEntity(entity: Entity) {
    this.entityManger.destroyEntity(entity)
    this.componentManager.entityDestroyed(entity)
    this.systemManger.entityDestroyed(entity)
  }

  registerComponent<ComponentType extends BaseComponent>(C: ComponentConstructor): void {
    this.componentManager.registerComponent<ComponentType>(C)
  }

  addComponent(entity: Entity, component: BaseComponent): void {
    this.componentManager.addComponent(entity, component)

    let signature: Signature = this.entityManger.getSignature(entity)
    signature.set(this.componentManager.getComponentIndex(component), true)
    this.entityManger.setSignature(entity, signature)

    this.systemManger.entitySignatureChanged(entity, signature)
  }

  addComponents(entity: Entity, components: BaseComponent[]): void {
    let signatureMask: Signature = new Signature()

    for (let component of components) {
      this.componentManager.addComponent(entity, component)
      signatureMask.set(this.componentManager.getComponentIndex(component), true)
    }

    let signature: Signature = Signature.or(this.entityManger.getSignature(entity), signatureMask)
    this.entityManger.setSignature(entity, signature)
    this.systemManger.entitySignatureChanged(entity, signature)
  }

  removeComponent(entity: Entity, X: ComponentConstructor | BaseComponent): void {
    this.componentManager.removeComponent(entity, X)

    let signature: Signature = this.entityManger.getSignature(entity)
    signature.set(this.componentManager.getComponentIndex(X), false)
    this.entityManger.setSignature(entity, signature)

    this.systemManger.entitySignatureChanged(entity, signature)
  }

  removeComponents(entity: Entity, components: (ComponentConstructor | BaseComponent)[]): void {
    let signatureMask: Signature = new Signature(2 ** MAX_COMPONENTS - 1)

    for (let component of components) {
      this.componentManager.removeComponent(entity, component)
      signatureMask.set(this.componentManager.getComponentIndex(component), false)
    }

    let signature: Signature = Signature.and(this.entityManger.getSignature(entity), signatureMask)
    this.entityManger.setSignature(entity, signature)
    this.systemManger.entitySignatureChanged(entity, signature)
  }

  getComponent<ComponentType extends BaseComponent> (entitiy: Entity, C: ComponentConstructor<ComponentType>): ComponentType {
    return this.componentManager.getComponent<ComponentType>(entitiy, C)
  }

  getComponentIndex(X: ComponentConstructor | BaseComponent): ComponentIndex {
    return this.componentManager.getComponentIndex(X)
  }

  registerSystem(C: SystemConstructor): void {
    this.systemManger.registerSystem(C)
  }

  getSystem<SystemType extends BaseSystem>(C: SystemConstructor<SystemType>): SystemType {
    return this.systemManger.getSystem(C)
  }

  setSystemSignature(C: SystemConstructor, signature: Signature): void {
    this.systemManger.setSignature(C, signature)
  }
}