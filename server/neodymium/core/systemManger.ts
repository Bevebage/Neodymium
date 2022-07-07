import { Engine } from "./engine";
import { BaseSystem, Entity, Signature, SystemConstructor } from "./types_consts";

export class SystemManager {
  private signatures: {
    [key: string]: Signature
  }
  private systems: {
    [key: string]: BaseSystem
  }
  private engine: Engine

  constructor(engine: Engine) {
    this.signatures = {}
    this.systems = {}
    this.engine = engine
  }

  registerSystem(C: SystemConstructor): void {
    let typeName = C.name
    if (!(typeName in this.systems)) {
      this.systems[typeName] = new C(this.engine)
    } else {
      throw new Error('System already registered')
    }
  }

  getSystem<SystemType extends BaseSystem>(C: SystemConstructor<SystemType>): SystemType {
    let typeName = C.name
    if (typeName in this.systems) {
      return <SystemType>this.systems[typeName]
    } else {
      throw new Error('System not registered before use')
    }
  }

  setSignature(C: SystemConstructor, signature: Signature): void {
    let typeName = C.name
    if (typeName in this.systems) {
      this.signatures[typeName] = signature
    } else {
      throw new Error('System not registered before use')
    }
  }

  entityDestroyed(entity: Entity): void {
    for(let system of Object.values(this.systems) as BaseSystem[]) {
      system.entities.delete(entity)
    }
  }

  entitySignatureChanged(entity: Entity, signature: Signature): void {
    for (let [type, system] of Object.entries(this.systems) as [string, BaseSystem][]) {
      let systemSignature: Signature = this.signatures[type]

      if (Signature.equals(Signature.and(signature, systemSignature), systemSignature)) {
        system.entities.add(entity)
      } else {
        system.entities.delete(entity)
      }
    }
  }
}