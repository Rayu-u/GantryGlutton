namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class Customer extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Customer);

    static readonly #fruitColors: Map<FruitType, f.Color> = new Map();

    /** How long will the customer live after being dispatch. */
    static readonly #afterDispatchLifetime = 12;
    static test: Customer;

    #fruitType: FruitType;

    #bodyModelMaterial: f.ComponentMaterial;
    #jointSimulationRigidbody: f.ComponentRigidbody;
    #modelTransform: f.ComponentTransform;

    #isDetached: boolean = false;

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
          const model = this.node.getChildrenByName("Model")[0];

          this.#bodyModelMaterial = model
            .getChildrenByName("Body")[0]
            .getComponent(f.ComponentMaterial);
          this.#jointSimulationRigidbody = this.node
            .getChildrenByName("JointSimulation")[0]
            .getComponent(f.ComponentRigidbody);
          this.#modelTransform = model.getComponent(f.ComponentTransform);

          addAfterPhysicsUpdateSubscriber(this);
          break;
      }
    };

    public getFruitType = (): FruitType => {
      return this.#fruitType;
    };

    public setFruitType = (fruitType: FruitType): void => {
      this.#fruitType = fruitType;

      if (Customer.#fruitColors.size === 0) {
        Customer.#fruitColors.set(FruitType.Banana, new f.Color(1, 0.84, 0, 1));
        Customer.#fruitColors.set(
          FruitType.Blueberry,
          new f.Color(0.24, 0.24, 0.71, 1)
        );
        Customer.#fruitColors.set(
          FruitType.Cherry,
          new f.Color(0.84, 0.16, 0.26, 1)
        );
        Customer.#fruitColors.set(
          FruitType.Pear,
          new f.Color(0.47, 0.84, 0.16, 1)
        );

        Customer.test = this;
      }

      this.#bodyModelMaterial.clrPrimary = Customer.#fruitColors.get(fruitType);
    };

    public onAfterPhysicsUpdate = (): void => {
      if (this.#isDetached) {
        return;
      }

      this.#modelTransform.mtxLocal = f.Matrix4x4.ROTATION(
        this.#jointSimulationRigidbody.getRotation()
      );
    };

    public detach = async (): Promise<void> => {
      // Move model and dynamic rigidbody to root of scene.
      this.node.removeChild(this.#modelTransform.node);
      this.node.removeChild(this.#jointSimulationRigidbody.node);

      this.#jointSimulationRigidbody.dampRotation = 0;
      this.#jointSimulationRigidbody.effectGravity = 1;
      this.#jointSimulationRigidbody.node.addChild(this.#modelTransform.node);
      this.#modelTransform.mtxLocal = f.Matrix4x4.IDENTITY();

      graph.addChild(this.#jointSimulationRigidbody.node);
      this.#jointSimulationRigidbody.node.getComponent(
        f.ComponentTransform
      ).mtxLocal = f.Matrix4x4.TRANSLATION(
        this.node.getComponent(f.ComponentRigidbody).getPosition()
      );

      // Add random torque for tumble
      const randomAngularImpulse = new f.Vector3(
        2 * Math.random() - 1,
        2 * Math.random() - 1,
        2 * Math.random() - 1
      );
      this.#jointSimulationRigidbody.applyAngularImpulse(randomAngularImpulse);

      // Remove the customer node, which acted like the attachment point to the stage and platform.
      this.node.removeComponent(this.node.getComponent(f.JointSpherical));
      this.node.getParent().removeChild(this.node);

      this.#isDetached = true;

      // Wait for the customer to fall outside of view.
      await new Promise((resolver) =>
        setTimeout(resolver, 1000 * Customer.#afterDispatchLifetime)
      );

      // Remove remaining customer.
      this.#jointSimulationRigidbody.node
        .getParent()
        .removeChild(this.#jointSimulationRigidbody.node);
    };
  }
}
