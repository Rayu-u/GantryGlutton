namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class Group extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Group);

    static readonly #maxCustomerCount: number = 3;

    #customers: Customer[] = [];

    static readonly #relativeCustomerPositions: f.Vector3[] = [
      new f.Vector3(0, 0, 0),
      new f.Vector3(-0.5, 0, -0.5),
      new f.Vector3(0.5, 0, -0.5),
      new f.Vector3(0, 0, -1),
    ];

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

    public addCustomer = (customer: Customer) => {
      if (Group.#maxCustomerCount <= this.#customers.length) {
        console.warn(
          "No more customers can be added when the group already contains the max amount, which is ",
          Group.#maxCustomerCount
        );
        return;
      }

      const currentCustomerIndex = this.#customers.length;
      this.#customers.push(customer);
      this.node.addChild(customer.node);

      const customerTransform = customer.node.getComponent(
        f.ComponentTransform
      );

      customerTransform.mtxLocal = f.Matrix4x4.TRANSLATION(
        Group.#relativeCustomerPositions[currentCustomerIndex]
      );
    };
  }
}
