namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class Customer extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Customer);

    private rigidbody: f.ComponentRigidbody;
    private modelRigidbody: f.ComponentRigidbody;

    private modelPositionBuffer: f.Vector3 = f.Vector3.ZERO();

    private test: boolean = false;

    constructor() {
      super();

      // Don't start when running in editor
      if (f.Project.mode == f.MODE.EDITOR) return;

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
          this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
          this.modelRigidbody = this.node
            .getChildrenByName("Model")[0]
            .getComponent(f.ComponentRigidbody);
          addAfterDrawUpdateSubscriber(this);
          addAfterPhysicsBeforeDrawUpdateSubscriber(this);
          break;
      }
    };

    public onAfterPhysicsBeforeDrawUpdate = (): void => {
      this.modelPositionBuffer = this.modelRigidbody.getPosition();
      this.modelRigidbody.setPosition(this.rigidbody.getPosition());
    };

    public onAfterDrawUpdate = (): void => {
      this.modelRigidbody.setPosition(this.modelPositionBuffer);
    };
  }
}
