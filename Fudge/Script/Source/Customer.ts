namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class Customer extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Customer);
    private static readonly fruitColors: Map<FruitType, f.Color> = new Map();

    private _fruitType: FruitType;

    private rigidbody: f.ComponentRigidbody;
    private bodyMaterial: f.ComponentMaterial;
    private modelRigidbody: f.ComponentRigidbody;

    private modelPositionBuffer: f.Vector3 = f.Vector3.ZERO();

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
          const model = this.node.getChildrenByName("Model")[0];
          this.modelRigidbody = model.getComponent(f.ComponentRigidbody);
          this.bodyMaterial = model
            .getChildrenByName("Body")[0]
            .getComponent(f.ComponentMaterial);
          addAfterDrawUpdateSubscriber(this);
          addAfterPhysicsBeforeDrawUpdateSubscriber(this);
          break;
      }
    };

    public get fruitType(): FruitType {
      return this._fruitType;
    }

    public set fruitType(fruitType: FruitType) {
      this._fruitType = fruitType;

      if (Customer.fruitColors.size === 0) {
        Customer.fruitColors.set(FruitType.Banana, new f.Color(255, 213, 0, 1));
        Customer.fruitColors.set(
          FruitType.Blueberry,
          new f.Color(62, 60, 180, 1)
        );
        Customer.fruitColors.set(FruitType.Cherry, new f.Color(215, 40, 66, 1));
        Customer.fruitColors.set(FruitType.Pear, new f.Color(119, 215, 40, 1));
      }

      this.bodyMaterial.clrPrimary = Customer.fruitColors.get(fruitType);
    }

    public onAfterPhysicsBeforeDrawUpdate = (): void => {
      this.modelPositionBuffer = this.modelRigidbody.getPosition();
      this.modelRigidbody.setPosition(this.rigidbody.getPosition());
    };

    public onAfterDrawUpdate = (): void => {
      this.modelRigidbody.setPosition(this.modelPositionBuffer);
    };
  }
}
