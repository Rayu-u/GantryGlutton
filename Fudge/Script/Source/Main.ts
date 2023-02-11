namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");
  
  //let cmpCamera: f.ComponentCamera;
  let viewport: f.Viewport;
  let graph: f.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let leftKeyCode: f.KEYBOARD_CODE[] = [f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT]
  let rightKeyCode: f.KEYBOARD_CODE[] = [f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT]
  let upKeyCode: f.KEYBOARD_CODE[] = [f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP]
  let downKeyCode: f.KEYBOARD_CODE[] = [f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN]

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    graph = viewport.getBranch();
    let referenceCameraObject: f.Node = graph.getChildrenByName("CameraReference")[0];
    viewport.camera.projectOrthographic();

    viewport.camera.mtxPivot = referenceCameraObject.getComponent(f.ComponentTransform).mtxLocal;
    f.Debug.log(viewport.camera.mtxPivot);
    f.Debug.log(referenceCameraObject.getComponent(f.ComponentTransform).mtxLocal);
    f.Debug.log(viewport.camera);

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  type CardinalDirection = "" | "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

  function update(_event: Event): void {
    
    const inputDirection = getInputAsCardinalDirection();
    const gantryBaseActivation = getGantryBaseActivation(inputDirection);
    const gantryBridgeActivation = getGantryBridgeActivation(inputDirection);
    console.log(`Base activation: ${gantryBaseActivation}, bridge Activation: ${gantryBridgeActivation}`);

    // f.Physics.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();
  }

  /**
   * Get the cardinal direction of current WASD or arrow input.
   * 
   * @returns The cardinal direction of current WASD or arrow input.
   */
  function getInputAsCardinalDirection(): CardinalDirection {
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

  const getGantryBaseDirection__positiveGroup: CardinalDirection[] = ["N", "NE", "E"];
  const getGantryBaseDirection__negativeGroup: CardinalDirection[] = ["S", "SW", "W"];
  /**
   * Get the activation direction of the gantry base motor.
   * 
   * @param inputDirection The direction of the input.
   * @returns The activation direction of the gantry base.
   */
  function getGantryBaseActivation(inputDirection: CardinalDirection): number {
    return classifyCardinalDirection(
      inputDirection,
      getGantryBaseDirection__positiveGroup,
      getGantryBaseDirection__negativeGroup,
    );
  }

  const getGantryBridgeDirection__positiveGroup: CardinalDirection[] = ["W", "NW", "N"];
  const getGantryBridgeDirection__negativeGroup: CardinalDirection[] = ["E", "SE", "S"];
  /**
   * Get the activation direction of the gantry bridge motor.
   * 
   * @param inputDirection The direction of the input.
   * @returns The activation direction of the gantry bridge.
   */
  function getGantryBridgeActivation(inputDirection: CardinalDirection): number {
    return classifyCardinalDirection(
      inputDirection,
      getGantryBridgeDirection__positiveGroup,
      getGantryBridgeDirection__negativeGroup,
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
  function classifyCardinalDirection(
    direction: CardinalDirection,
    positiveGroup: CardinalDirection[],
    negativeGroup: CardinalDirection[]
  ): number {
    if (positiveGroup.includes(direction)){
      return 1;
    } else if (negativeGroup.includes(direction)) {
      return -1;
    } else {
      return 0;
    }
  }
}
