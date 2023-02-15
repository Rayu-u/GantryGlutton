namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class Trapdoor extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Trapdoor);

    #locked: boolean = true;
    #rigidbody: f.ComponentRigidbody;
    #torqueVector: f.Vector3 = f.Vector3.ZERO();

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
          this.#rigidbody = this.node.getComponent(f.ComponentRigidbody);
          addAfterPhysicsUpdateSubscriber(this);
          break;
      }
    };

    public onAfterPhysicsUpdate = (): void => {
      const rotation: f.Vector3 = this.#rigidbody.getRotation();

      if (this.#locked || rotation.x < 0) {
        rotation.x = 0;
        this.#locked = true;
        this.#torqueVector = f.Vector3.ZERO();
      } else if (rotation.x > 180) {
        rotation.x = 180;
      } else {
        return;
      }

      this.#rigidbody.setRotation(rotation);
    };

    public open = async (
      openAngularImpulse: number,
      closeTorque: number,
      duration: number
    ): Promise<void> => {
      // Open trapdoor slightly to avoid lock
      const oldRotation = this.#rigidbody.getRotation();
      oldRotation.x = 1;
      this.#rigidbody.setRotation(oldRotation);

      this.#locked = false;

      // Hit the trapdoor open
      this.#rigidbody.applyAngularImpulse(
        new f.Vector3(openAngularImpulse, 0, 0)
      );

      // Wait and apply close torque
      await new Promise((resolve) => setTimeout(resolve, 1000 * duration));
      this.#torqueVector = new f.Vector3(closeTorque, 0, 0);
    };
  }
}
