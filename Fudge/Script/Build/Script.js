"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    //let cmpCamera: f.ComponentCamera;
    let viewport;
    let graph;
    document.addEventListener("interactiveViewportStarted", start);
    let leftKeyCode = [f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT];
    let rightKeyCode = [f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT];
    let upKeyCode = [f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP];
    let downKeyCode = [f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN];
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        let referenceCameraObject = graph.getChildrenByName("CameraReference")[0];
        viewport.camera.projectOrthographic();
        viewport.camera.mtxPivot = referenceCameraObject.getComponent(f.ComponentTransform).mtxLocal;
        f.Debug.log(viewport.camera.mtxPivot);
        f.Debug.log(referenceCameraObject.getComponent(f.ComponentTransform).mtxLocal);
        f.Debug.log(viewport.camera);
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
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
    function getInputAsCardinalDirection() {
        let cardinalDirection = "";
        const up = f.Keyboard.isPressedOne(upKeyCode);
        const down = f.Keyboard.isPressedOne(downKeyCode);
        if (up && !down) {
            cardinalDirection += "N";
        }
        else if (down && !up) {
            cardinalDirection += "S";
        }
        const right = f.Keyboard.isPressedOne(rightKeyCode);
        const left = f.Keyboard.isPressedOne(leftKeyCode);
        if (right && !left) {
            cardinalDirection += "E";
        }
        else if (left && !right) {
            cardinalDirection += "W";
        }
        return cardinalDirection;
    }
    const getGantryBaseDirection__positiveGroup = ["N", "NE", "E"];
    const getGantryBaseDirection__negativeGroup = ["S", "SW", "W"];
    /**
     * Get the activation direction of the gantry base motor.
     *
     * @param inputDirection The direction of the input.
     * @returns The activation direction of the gantry base.
     */
    function getGantryBaseActivation(inputDirection) {
        return classifyCardinalDirection(inputDirection, getGantryBaseDirection__positiveGroup, getGantryBaseDirection__negativeGroup);
    }
    const getGantryBridgeDirection__positiveGroup = ["W", "NW", "N"];
    const getGantryBridgeDirection__negativeGroup = ["E", "SE", "S"];
    /**
     * Get the activation direction of the gantry bridge motor.
     *
     * @param inputDirection The direction of the input.
     * @returns The activation direction of the gantry bridge.
     */
    function getGantryBridgeActivation(inputDirection) {
        return classifyCardinalDirection(inputDirection, getGantryBridgeDirection__positiveGroup, getGantryBridgeDirection__negativeGroup);
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
    function classifyCardinalDirection(direction, positiveGroup, negativeGroup) {
        if (positiveGroup.includes(direction)) {
            return 1;
        }
        else if (negativeGroup.includes(direction)) {
            return -1;
        }
        else {
            return 0;
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map