namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton);  // Register the namespace to FUDGE for serialization

  export class Fruit extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = f.Component.registerSubclass(Fruit);
    private static fallSpeed: number = 5;
    private static fruitIndicationDuration: number = 10;

    private modelTransform: f.ComponentTransform;
    private shadowTransform: f.ComponentTransform;

    constructor() {
      super();
      
      // Don't start when running in editor
      if (f.Project.mode == f.MODE.EDITOR)
      return;
      
      // Listen to this component being added to or removed from a node
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(f.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }
    
    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case f.EVENT.COMPONENT_ADD:
          this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case f.EVENT.NODE_DESERIALIZED:
          this.modelTransform = this.node.getChildrenByName("Model")[0].getComponent(f.ComponentTransform);
          this.shadowTransform = this.node.getChildrenByName("Shadow")[0].getComponent(f.ComponentTransform);
          this.shadowTransform.mtxLocal.scaling = f.Vector3.ZERO();          
          break;
      }
    }

    public supplyFallDuration = (fallDuration: number): void => {
      const oldModelPosition = this.modelTransform.mtxLocal.translation;
      oldModelPosition.y = fallDuration * Fruit.fallSpeed;
      this.modelTransform.mtxLocal.translation = oldModelPosition;
    }

    public update = (_event: Event): void => {
      const deltaTime: number = f.Loop.timeFrameGame / 1000;
      this.modelTransform.mtxLocal.translateY(-deltaTime * Fruit.fallSpeed);

      const remainingFallDuration: number = this.modelTransform.mtxLocal.translation.y / Fruit.fallSpeed;
      if (0 < remainingFallDuration && remainingFallDuration < Fruit.fruitIndicationDuration) {
        this.shadowTransform.mtxLocal = f.Matrix4x4.SCALING(f.Vector3.ONE(1 - remainingFallDuration / Fruit.fruitIndicationDuration));
      } else {
        this.shadowTransform.mtxLocal.scaling = f.Vector3.ZERO();
      }
    } 
  }
}