namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class Group extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Group);

    static readonly #maxCustomerCount: number = 3;
    static readonly #relativeCustomerPositions: f.Vector3[] = [
      new f.Vector3(0, 0, 0),
      new f.Vector3(-0.5, 0, -0.5),
      new f.Vector3(0.5, 0, -0.5),
      new f.Vector3(0, 0, -1),
    ];
    static readonly #speed: number = 10;

    public customers: Customer[] = [];

    #localTargetPosition: f.Vector3 = f.Vector3.ZERO();
    #moving: boolean = true;
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
          this.#transform = this.node.getComponent(f.ComponentTransform);
          this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
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
      if (Group.#maxCustomerCount <= this.customers.length) {
        console.warn(
          "No more customers can be added when the group already contains the max amount, which is ",
          Group.#maxCustomerCount
        );
        return;
      }

      const currentCustomerIndex = this.customers.length;
      this.customers.push(customer);
      this.node.addChild(customer.node);

      const customerTransform = customer.node.getComponent(
        f.ComponentTransform
      );

      customerTransform.mtxLocal = f.Matrix4x4.TRANSLATION(
        Group.#relativeCustomerPositions[currentCustomerIndex]
      );
    };

    public moveTo = (
      localTargetPosition: f.Vector3,
      instant: boolean
    ): void => {
      if (instant) {
        this.#transform.mtxLocal.translation = localTargetPosition;
        this.#moving = false;
      } else {
        this.#localTargetPosition = localTargetPosition;
        this.#moving = true;
      }
    };

    private update = (_event: Event): void => {
      if (!this.#moving) {
        return;
      }

      const remainingTravel = f.Vector3.DIFFERENCE(
        this.#localTargetPosition,
        this.#transform.mtxLocal.translation
      );
      const remainingDistance = remainingTravel.magnitude;
      const deltaTime: number = f.Loop.timeFrameGame / 1000;
      const distanceToTravelThisFrame = deltaTime * Group.#speed;

      if (remainingDistance < distanceToTravelThisFrame) {
        this.#transform.mtxLocal.translation = this.#localTargetPosition;
        this.#moving = false;
      } else {
        this.#transform.mtxLocal.translate(
          f.Vector3.SCALE(
            f.Vector3.NORMALIZATION(remainingTravel),
            distanceToTravelThisFrame
          )
        );
      }
    };
  }
}
