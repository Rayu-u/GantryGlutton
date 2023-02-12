namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  type CardinalDirection =
    | ""
    | "N"
    | "NE"
    | "E"
    | "SE"
    | "S"
    | "SW"
    | "W"
    | "NW";

  let leftKeyCode: f.KEYBOARD_CODE[] = [
    f.KEYBOARD_CODE.A,
    f.KEYBOARD_CODE.ARROW_LEFT,
  ];
  let rightKeyCode: f.KEYBOARD_CODE[] = [
    f.KEYBOARD_CODE.D,
    f.KEYBOARD_CODE.ARROW_RIGHT,
  ];
  let upKeyCode: f.KEYBOARD_CODE[] = [
    f.KEYBOARD_CODE.W,
    f.KEYBOARD_CODE.ARROW_UP,
  ];
  let downKeyCode: f.KEYBOARD_CODE[] = [
    f.KEYBOARD_CODE.S,
    f.KEYBOARD_CODE.ARROW_DOWN,
  ];

  export class Platform extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Platform);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CustomComponentScript added to ";
    public motorForce: number = 1;
    private rigidbody: f.ComponentRigidbody;
    private initialY: number;

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
          this.node.addEventListener(f.EVENT.RENDER_PREPARE, this.update);
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case f.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          this.start(_event);
          break;
      }
    };

    public start = (_event: Event): void => {
      this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
      this.initialY = this.node.getComponent(f.ComponentTransform).mtxLocal.translation.y;
    };
    
    public update = (_event: Event): void => {      
      //f.Physics.simulate();
      //this.node.dispatchEvent(new Event("SensorHit", {bubbles: true}));
      const inputDirection = this.getInputAsCardinalDirection();
      const gantryBaseActivation =
        Platform.getGantryBaseActivation(inputDirection);
      const gantryBridgeActivation =
        Platform.getGantryBridgeActivation(inputDirection);

      this.rigidbody.applyForce(
        new f.Vector3(
          this.motorForce * gantryBaseActivation,
          0,
          -this.motorForce * gantryBridgeActivation
        )
      );
      const oldPosition: f.Vector3 = this.rigidbody.getPosition();
      oldPosition.y = this.initialY;
      this.rigidbody.setPosition(oldPosition);
      this.rigidbody.setRotation(f.Vector3.ZERO());
    };

    /**
     * Get the cardinal direction of current WASD or arrow input.
     *
     * @returns The cardinal direction of current WASD or arrow input.
     */
    getInputAsCardinalDirection(): CardinalDirection {
      let cardinalDirection = "";

      const up = f.Keyboard.isPressedOne(upKeyCode);
      const down = f.Keyboard.isPressedOne(downKeyCode);
      if (up && !down) {
        cardinalDirection += "N";
      } else if (down && !up) {
        cardinalDirection += "S";
      }
      const right = f.Keyboard.isPressedOne(rightKeyCode);
      const left = f.Keyboard.isPressedOne(leftKeyCode);
      if (right && !left) {
        cardinalDirection += "E";
      } else if (left && !right) {
        cardinalDirection += "W";
      }
      return cardinalDirection as CardinalDirection;
    }

    static getGantryBaseDirection__positiveGroup: CardinalDirection[] = [
      "N",
      "NE",
      "E",
    ];
    static getGantryBaseDirection__negativeGroup: CardinalDirection[] = [
      "S",
      "SW",
      "W",
    ];
    /**
     * Get the activation direction of the gantry base motor.
     *
     * @param inputDirection The direction of the input.
     * @returns The activation direction of the gantry base.
     */
    static getGantryBaseActivation(inputDirection: CardinalDirection): number {
      return Platform.classifyCardinalDirection(
        inputDirection,
        Platform.getGantryBaseDirection__positiveGroup,
        Platform.getGantryBaseDirection__negativeGroup
      );
    }

    static getGantryBridgeDirection__positiveGroup: CardinalDirection[] = [
      "W",
      "NW",
      "N",
    ];
    static getGantryBridgeDirection__negativeGroup: CardinalDirection[] = [
      "E",
      "SE",
      "S",
    ];
    /**
     * Get the activation direction of the gantry bridge motor.
     *
     * @param inputDirection The direction of the input.
     * @returns The activation direction of the gantry bridge.
     */
    static getGantryBridgeActivation(
      inputDirection: CardinalDirection
    ): number {
      return Platform.classifyCardinalDirection(
        inputDirection,
        Platform.getGantryBridgeDirection__positiveGroup,
        Platform.getGantryBridgeDirection__negativeGroup
      );
    }

    /**
     *
     * Classify the supplied direction into positive, negative or neutral in the form of a number.
     *
     * @param direction The direction that should be classified.
     * @param positiveGroup The group of positive directions.
     * @param negativeGroup The group of negative directions.
     * @returns The group that the supplied direction was in in the form of a number.
     */
    static classifyCardinalDirection(
      direction: CardinalDirection,
      positiveGroup: CardinalDirection[],
      negativeGroup: CardinalDirection[]
    ): number {
      if (positiveGroup.includes(direction)) {
        return 1;
      } else if (negativeGroup.includes(direction)) {
        return -1;
      } else {
        return 0;
      }
    }
  }
}
