namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class CustomerQueue extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(CustomerQueue);

    public static customerGraphResource: f.Graph;
    public static targetGroupCount: number = 2;

    static readonly #groupNumberMap: number[] = [1, 1, 1, 1, 1, 1, 2, 2, 2, 3];

    /**
     * The offset between groups in local space.
     */
    static readonly groupOffset: f.Vector3 = new f.Vector3(0, 0, -2);

    #groups: Group[] = [];

    constructor() {
      super();

      // Don't start when running in editor
      if (f.Project.mode == f.MODE.EDITOR) return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(f.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public generateQueue = (): void => {
      this.ensureGroupCount();
    };

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
          this.node
            .getComponent(f.ComponentRigidbody)
            .addEventListener(
              f.EVENT_PHYSICS.TRIGGER_ENTER,
              this.handlePlayerEnterPickupZone
            );
          break;
      }
    };

    private handlePlayerEnterPickupZone = (_event: f.EventPhysics): void => {
      if (_event.cmpRigidbody.node.name !== "Platform") {
        return;
      }

      const platform: Platform =
        _event.cmpRigidbody.node.getComponent(Platform);
      this.ensureGroupCount();
    };

    private createGroup = async (): Promise<Group> => {
      const randomGroupSize: number =
        CustomerQueue.#groupNumberMap[
          Math.floor(CustomerQueue.#groupNumberMap.length * Math.random())
        ];

      const groupNode: f.Node = new f.Node("Group");
      groupNode.addComponent(new f.ComponentTransform());
      const groupComponent: Group = new Group();
      groupNode.addComponent(groupComponent);

      const addCustomerPromises: Promise<void>[] = [];
      const createAndAddCustomer = async (): Promise<void> => {
        groupComponent.addCustomer(await this.createRandomCustomer());
      };
      for (let i = 0; i < randomGroupSize; i++) {
        addCustomerPromises.push(createAndAddCustomer());
      }

      await Promise.all(addCustomerPromises);
      return groupComponent;
    };

    private createRandomCustomer = async (): Promise<Customer> => {
      if (!CustomerQueue.customerGraphResource) {
        CustomerQueue.customerGraphResource = <f.Graph>(
          f.Project.getResourcesByName("Customer")[0]
        );
      }

      const customerGraphInstance: f.GraphInstance =
        await f.Project.createGraphInstance(
          CustomerQueue.customerGraphResource
        );
      const customer: Customer = customerGraphInstance.getComponent(Customer);
      customer.setFruitType(getRandomFruitType());
      return customer;
    };

    private ensureGroupCount = async (): Promise<void> => {
      while (this.#groups.length < CustomerQueue.targetGroupCount) {
        const group: Group = await this.createGroup();
        this.#groups.push(group);
        this.node.addChild(group.node);
      }

      this.updateGroupPositions();
    };

    private updateGroupPositions = (): void => {
      for (let i = 0; i < this.#groups.length; i++) {
        const groupNode = this.#groups[i].node;
        const groupTransform = groupNode.getComponent(f.ComponentTransform);
        groupTransform.mtxLocal = f.Matrix4x4.TRANSLATION(
          f.Vector3.SCALE(CustomerQueue.groupOffset, i)
        );
      }
    };
  }
}
