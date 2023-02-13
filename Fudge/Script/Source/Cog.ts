namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton);  // Register the namespace to FUDGE for serialization

  export class Cog extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = f.Component.registerSubclass(Cog);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public platformRigidbody: f.ComponentRigidbody;
    private transform: f.ComponentTransform;
    public platformVelocityDimensionSelector: f.Vector3 = f.Vector3.ZERO();

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
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case f.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          addAfterPhysicsBeforeDrawUpdateSubscriber(this);
          this.transform = this.node.getComponent(f.ComponentTransform);
          break;
      }
    }

    public onAfterPhysicsBeforeDrawUpdate = () => {
      const relevantSpeed = f.Vector3.DOT(this.platformRigidbody.getVelocity(), this.platformVelocityDimensionSelector);
      const deltaTime: number = f.Loop.timeFrameGame / 1000;
      const angle = deltaTime * relevantSpeed * 360 / Math.PI;      
      
      this.transform.mtxLocal.rotateX(angle);
    };
  }
}