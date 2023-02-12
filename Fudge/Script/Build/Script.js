"use strict";
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class Cog extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Cog);
        // Properties may be mutated by users in the editor via the automatically created user interface
        platformRigidbody;
        transform;
        platformVelocityDimensionSelector = f.Vector3.ZERO();
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    GantryGlutton.addAfterPhysicsUpdateSubscriber(this);
                    this.transform = this.node.getComponent(f.ComponentTransform);
                    break;
            }
        };
        onAfterPhysicsUpdate = () => {
            const relevantSpeed = f.Vector3.DOT(this.platformRigidbody.getVelocity(), this.platformVelocityDimensionSelector);
            const deltaTime = f.Loop.timeFrameGame / 1000;
            const angle = deltaTime * relevantSpeed * 360 / Math.PI;
            this.transform.mtxLocal.rotateX(angle);
        };
    }
    GantryGlutton.Cog = Cog;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    /**
     * Types of fruit.
     */
    let FruitType;
    (function (FruitType) {
        FruitType[FruitType["Banana"] = 0] = "Banana";
        FruitType[FruitType["Blueberry"] = 1] = "Blueberry";
        FruitType[FruitType["Cherry"] = 2] = "Cherry";
        FruitType[FruitType["Pear"] = 3] = "Pear";
    })(FruitType || (FruitType = {}));
    class Course extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Course);
        /**
         * The number of seconds until the first fruit spawns.
         */
        courseDelay = 1;
        /**
         * The number of fruits that drop per course.
         */
        fruitCourseLength = 50;
        /**
         * The longest possible interval between fruit spawning.
         */
        maxFruitInterval = 1;
        /**
         * The shortest possible interval between fruit spawning.
         */
        minFruitInterval = 0;
        fruitCourse = [];
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    this.generateCourseSpecifications();
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        generateCourseSpecifications = () => {
            let timeFromStart = this.courseDelay;
            for (let i = 0; i < this.fruitCourseLength; i++) {
                const randomFruit = Math.floor(4 * Math.random());
                this.fruitCourse.push({ time: timeFromStart, type: randomFruit });
                timeFromStart +=
                    this.maxFruitInterval * Math.random() + this.minFruitInterval;
            }
            console.log(this.fruitCourse);
        };
    }
    GantryGlutton.Course = Course;
})(GantryGlutton || (GantryGlutton = {}));
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
var GantryGlutton;
(function (GantryGlutton) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class CustomerManager extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomerManager);
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
    GantryGlutton.CustomerManager = CustomerManager;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class Fruit extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Fruit);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    f.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    GantryGlutton.Fruit = Fruit;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class Gantry extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Gantry);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    f.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    this.start(_event);
                    break;
            }
        };
        start = (_event) => {
            let platformRigidbody = this.node.getChildrenByName("Platform")[0].getComponent(f.ComponentRigidbody);
            this.node.getChildrenByName("Bridge")[0].getComponent(GantryGlutton.GantryBridge).platformRigidbody = platformRigidbody;
            this.node.getChildrenByName("Base")[0].getChildrenByName("Cog")[0].getComponent(GantryGlutton.Cog).platformRigidbody = platformRigidbody;
            this.node.getChildrenByName("Bridge")[0].getChildrenByName("Cog")[0].getComponent(GantryGlutton.Cog).platformRigidbody = platformRigidbody;
        };
    }
    GantryGlutton.Gantry = Gantry;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class GantryBridge extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(GantryBridge);
        // Properties may be mutated by users in the editor via the automatically created user interface
        platformOffset = 0;
        platformRigidbody;
        transform;
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    this.start(_event);
                    break;
            }
        };
        onAfterPhysicsUpdate = () => {
            const oldPosition = this.transform.mtxLocal.translation;
            oldPosition.x = this.platformRigidbody.getPosition().x + this.platformOffset;
            this.transform.mtxLocal.translation = oldPosition;
        };
        start = (_event) => {
            this.transform = this.node.getComponent(f.ComponentTransform);
            GantryGlutton.addAfterPhysicsUpdateSubscriber(this);
        };
    }
    GantryGlutton.GantryBridge = GantryBridge;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    //let cmpCamera: f.ComponentCamera;
    let viewport;
    let graph;
    document.addEventListener("interactiveViewportStarted", start);
    const afterPhysicsUpdateSubscribers = [];
    function addAfterPhysicsUpdateSubscriber(subcriber) {
        afterPhysicsUpdateSubscribers.push(subcriber);
    }
    GantryGlutton.addAfterPhysicsUpdateSubscriber = addAfterPhysicsUpdateSubscriber;
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        let referenceCameraObject = graph.getChildrenByName("CameraReference")[0];
        viewport.camera.projectCentral(undefined, 60);
        viewport.camera.mtxPivot = referenceCameraObject.getComponent(f.ComponentTransform).mtxLocal;
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        f.Physics.simulate(); // if physics is included and used
        for (const subcriber of afterPhysicsUpdateSubscribers) {
            subcriber.onAfterPhysicsUpdate();
        }
        viewport.draw();
        f.AudioManager.default.update();
    }
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    let leftKeyCode = [
        f.KEYBOARD_CODE.A,
        f.KEYBOARD_CODE.ARROW_LEFT,
    ];
    let rightKeyCode = [
        f.KEYBOARD_CODE.D,
        f.KEYBOARD_CODE.ARROW_RIGHT,
    ];
    let upKeyCode = [
        f.KEYBOARD_CODE.W,
        f.KEYBOARD_CODE.ARROW_UP,
    ];
    let downKeyCode = [
        f.KEYBOARD_CODE.S,
        f.KEYBOARD_CODE.ARROW_DOWN,
    ];
    class Platform extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Platform);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        motorForce = 1;
        rigidbody;
        initialY;
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                    this.node.addEventListener("renderPrepare" /* f.EVENT.RENDER_PREPARE */, this.update);
                    break;
                case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    this.start(_event);
                    break;
            }
        };
        start = (_event) => {
            this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
            this.initialY = this.node.getComponent(f.ComponentTransform).mtxLocal.translation.y;
        };
        update = (_event) => {
            //f.Physics.simulate();
            //this.node.dispatchEvent(new Event("SensorHit", {bubbles: true}));
            const inputDirection = this.getInputAsCardinalDirection();
            const gantryBaseActivation = Platform.getGantryBaseActivation(inputDirection);
            const gantryBridgeActivation = Platform.getGantryBridgeActivation(inputDirection);
            this.rigidbody.applyForce(new f.Vector3(this.motorForce * gantryBaseActivation, 0, -this.motorForce * gantryBridgeActivation));
            const oldPosition = this.rigidbody.getPosition();
            oldPosition.y = this.initialY;
            this.rigidbody.setPosition(oldPosition);
            this.rigidbody.setRotation(f.Vector3.ZERO());
        };
        /**
         * Get the cardinal direction of current WASD or arrow input.
         *
         * @returns The cardinal direction of current WASD or arrow input.
         */
        getInputAsCardinalDirection() {
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
        static getGantryBaseDirection__positiveGroup = [
            "N",
            "NE",
            "E",
        ];
        static getGantryBaseDirection__negativeGroup = [
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
        static getGantryBaseActivation(inputDirection) {
            return Platform.classifyCardinalDirection(inputDirection, Platform.getGantryBaseDirection__positiveGroup, Platform.getGantryBaseDirection__negativeGroup);
        }
        static getGantryBridgeDirection__positiveGroup = [
            "W",
            "NW",
            "N",
        ];
        static getGantryBridgeDirection__negativeGroup = [
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
        static getGantryBridgeActivation(inputDirection) {
            return Platform.classifyCardinalDirection(inputDirection, Platform.getGantryBridgeDirection__positiveGroup, Platform.getGantryBridgeDirection__negativeGroup);
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
        static classifyCardinalDirection(direction, positiveGroup, negativeGroup) {
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
    }
    GantryGlutton.Platform = Platform;
})(GantryGlutton || (GantryGlutton = {}));
//# sourceMappingURL=Script.js.map