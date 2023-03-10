namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class CustomerQueue extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(CustomerQueue);

    public static customerGraphResource: f.Graph;

    static readonly #groupNumberMap: number[] = [1, 1, 1, 1, 1, 1, 2, 2, 2, 3];

    /**
     * The offset between groups in local space.
     */
    static readonly betweenGroupOffset: f.Vector3 = new f.Vector3(0, 0, -2);

    /**
     * The offset between the first group and the position of the queue.
     */
    static readonly firstGroupOffset: f.Vector3 = new f.Vector3(0, 0, -1);

    #groups: Group[] = [];
    #targetQueueSize: number;

    constructor() {
      super();

      // Don't start when running in editor
      if (f.Project.mode == f.MODE.EDITOR) return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(f.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public generateQueue = (config: Config): void => {
      this.#targetQueueSize = config.queueSize.value;
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

      const group = this.#groups[0];

      const platformInteractions: PlatformInteractions =
        _event.cmpRigidbody.node.getComponent(PlatformInteractions);
      if (platformInteractions.getEmptySpots() < group.customers.length) {
        // Player did not have enough space for the group.
        return;
      }

      this.#groups.shift();
      platformInteractions.seatCustomers(group.customers);
      group.node.removeChild(group.node);

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
      while (this.#groups.length < this.#targetQueueSize) {
        const group: Group = await this.createGroup();
        this.#groups.push(group);
        this.node.addChild(group.node);
        this.updateGroupPosition(group, this.#groups.length, true);
      }

      this.updateGroupPositions();
    };

    private updateGroupPosition = (
      group: Group,
      index: number,
      instant: boolean
    ): void => {
      const localTargetPosition = f.Vector3.SUM(
        CustomerQueue.firstGroupOffset,
        f.Vector3.SCALE(CustomerQueue.betweenGroupOffset, index)
      );
      group.moveTo(localTargetPosition, instant);
    };

    private updateGroupPositions = (): void => {
      for (let i = 0; i < this.#groups.length; i++) {
        this.updateGroupPosition(this.#groups[i], i, false);
      }
    };
  }
}
