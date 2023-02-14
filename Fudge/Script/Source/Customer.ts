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

    #rigidbody: f.ComponentRigidbody;
    #bodyMaterial: f.ComponentMaterial;
    #modelRigidbody: f.ComponentRigidbody;

    #modelPositionBuffer: f.Vector3;
    #modelRotationBuffer: f.Vector3;

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
          const model = this.node.getChildrenByName("Model")[0];
          this.#modelRigidbody = model.getComponent(f.ComponentRigidbody);
          this.#bodyMaterial = model
            .getChildrenByName("Body")[0]
            .getComponent(f.ComponentMaterial);

          addAfterDrawUpdateSubscriber(this);
          addAfterPhysicsBeforeDrawUpdateSubscriber(this);
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

      this.#bodyMaterial.clrPrimary = Customer.#fruitColors.get(fruitType);
      console.log(this.#bodyMaterial.clrPrimary, fruitType);
    };

    public onAfterPhysicsBeforeDrawUpdate = (): void => {
      // console.log(
      //   this.node.getComponent(f.ComponentRigidbody).getPosition().x,
      //   this.node.getComponent(f.ComponentRigidbody).getPosition().y,
      //   this.node.getComponent(f.ComponentRigidbody).getPosition().z
      // );
      if (this == Customer.test) {
        console.log(
          "customer rigidbody rotation",
          this.node.getComponent(f.ComponentRigidbody).getRotation().x,
          this.node.getComponent(f.ComponentRigidbody).getRotation().y,
          this.node.getComponent(f.ComponentRigidbody).getRotation().z
        );
        console.log(
          "model rigidbody rotation",
          this.#modelRigidbody.getRotation().x,
          this.#modelRigidbody.getRotation().y,
          this.#modelRigidbody.getRotation().z
        );
      }
      this.#modelPositionBuffer = this.#modelRigidbody.getPosition();
      this.#modelRigidbody.setPosition(this.#rigidbody.getPosition());
    };

    public onAfterDrawUpdate = (): void => {
      this.#modelRigidbody.setPosition(this.#modelPositionBuffer);
    };
  }
}
