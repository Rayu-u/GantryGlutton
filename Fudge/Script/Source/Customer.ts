namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class Customer extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Customer);
    static readonly #fruitColors: Map<FruitType, f.Color> = new Map();
    static test: Customer;

    #fruitType: FruitType;

    #bodyModelMaterial: f.ComponentMaterial;
    #jointSimulationRigidbody: f.ComponentRigidbody;
    #modelTransform: f.ComponentTransform;

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
      this.#modelTransform.mtxLocal = f.Matrix4x4.ROTATION(
        this.#jointSimulationRigidbody.getRotation()
      );
    };
  }
}
