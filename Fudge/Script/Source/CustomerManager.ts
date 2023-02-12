namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  /**
   * A customer.
   */
  interface Customer {
    fruitType: FruitType;
    node: f.Node;
  }

  /**
   * A group of customers.
   */
  interface CustomerGroup {
    /**
     * Move the customer group to the supplied position.
     *
     * @param position The position to move the group to.
     * @returns void.
     */
    moveTo: (position: f.Vector3) => void;
  }

  class CustomerQueue {
    /**
     * How many groups should there be in each queue.
     */
    private static readonly queueLength: number = 3;

    /**
     * The groups in this queue.
     */
    private readonly groups: CustomerGroup[] = [];

    /**
     * The offset between each group in the queue.
     */
    private readonly groupOffset: f.Vector3;

    /**
     * The position of the head of the queue, where the first group stands.
     */
    private readonly queueHeadPosition: f.Vector3;

    constructor(groupOffset: f.Vector3, queueHeadPosition: f.Vector3) {
      this.groupOffset = groupOffset;
      this.queueHeadPosition = queueHeadPosition;
    }

    private ensureEnoughGroups = () => {};

    private generateGroup = () => {};

    public removeFirstGroup = () => {};
  }

  export class CustomerManager extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(CustomerManager);

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
          break;
      }
    };
  }
}
