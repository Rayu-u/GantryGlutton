namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class GantryBridge extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(GantryBridge);

    public platformOffset: number = 0;
    public platformRigidbody: f.ComponentRigidbody;
    #transform: f.ComponentTransform;

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
          this.#transform = this.node.getComponent(f.ComponentTransform);
          addAfterPhysicsUpdateSubscriber(this);
          break;
      }
    };

    public onAfterPhysicsUpdate = () => {
      const oldPosition = this.#transform.mtxLocal.translation;
      oldPosition.x =
        this.platformRigidbody.getPosition().x + this.platformOffset;
      this.#transform.mtxLocal.translation = oldPosition;
    };
  }
}
