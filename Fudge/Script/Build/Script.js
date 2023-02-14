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
        platformVelocityDimensionSelector = f.Vector3.ZERO();
        #transform;
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
                    this.#transform = this.node.getComponent(f.ComponentTransform);
                    break;
            }
        };
        onAfterPhysicsUpdate = () => {
            const relevantSpeed = f.Vector3.DOT(this.platformRigidbody.getVelocity(), this.platformVelocityDimensionSelector);
            const deltaTime = f.Loop.timeFrameGame / 1000;
            const angle = (deltaTime * relevantSpeed * 360) / Math.PI;
            this.#transform.mtxLocal.rotateX(angle);
        };
    }
    GantryGlutton.Cog = Cog;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(CustomComponentScript);
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
    GantryGlutton.CustomComponentScript = CustomComponentScript;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class Customer extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Customer);
        static #fruitColors = new Map();
        static test;
        #fruitType;
        #bodyModelMaterial;
        #jointSimulationRigidbody;
        #modelTransform;
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
                    const model = this.node.getChildrenByName("Model")[0];
                    this.#bodyModelMaterial = model
                        .getChildrenByName("Body")[0]
                        .getComponent(f.ComponentMaterial);
                    this.#jointSimulationRigidbody = this.node
                        .getChildrenByName("JointSimulation")[0]
                        .getComponent(f.ComponentRigidbody);
                    this.#modelTransform = model.getComponent(f.ComponentTransform);
                    GantryGlutton.addAfterPhysicsUpdateSubscriber(this);
                    break;
            }
        };
        getFruitType = () => {
            return this.#fruitType;
        };
        setFruitType = (fruitType) => {
            this.#fruitType = fruitType;
            if (Customer.#fruitColors.size === 0) {
                Customer.#fruitColors.set(GantryGlutton.FruitType.Banana, new f.Color(1, 0.84, 0, 1));
                Customer.#fruitColors.set(GantryGlutton.FruitType.Blueberry, new f.Color(0.24, 0.24, 0.71, 1));
                Customer.#fruitColors.set(GantryGlutton.FruitType.Cherry, new f.Color(0.84, 0.16, 0.26, 1));
                Customer.#fruitColors.set(GantryGlutton.FruitType.Pear, new f.Color(0.47, 0.84, 0.16, 1));
                Customer.test = this;
            }
            this.#bodyModelMaterial.clrPrimary = Customer.#fruitColors.get(fruitType);
        };
        onAfterPhysicsUpdate = () => {
            this.#modelTransform.mtxLocal = f.Matrix4x4.ROTATION(this.#jointSimulationRigidbody.getRotation());
        };
    }
    GantryGlutton.Customer = Customer;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class CustomerQueue extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(CustomerQueue);
        static customerGraphResource;
        static targetGroupCount = 2;
        static #groupNumberMap = [1, 1, 1, 1, 1, 1, 2, 2, 2, 3];
        /**
         * The offset between groups in local space.
         */
        static groupOffset = new f.Vector3(0, 0, -2);
        #groups = [];
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
        generateQueue = () => {
            this.ensureGroupCount();
        };
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
                    this.node
                        .getComponent(f.ComponentRigidbody)
                        .addEventListener("TriggerEnteredCollision" /* f.EVENT_PHYSICS.TRIGGER_ENTER */, this.handlePlayerEnterPickupZone);
                    break;
            }
        };
        handlePlayerEnterPickupZone = (_event) => {
            if (_event.cmpRigidbody.node.name !== "Platform") {
                return;
            }
            const platform = _event.cmpRigidbody.node.getComponent(GantryGlutton.Platform);
            this.ensureGroupCount();
        };
        createGroup = async () => {
            const randomGroupSize = CustomerQueue.#groupNumberMap[Math.floor(CustomerQueue.#groupNumberMap.length * Math.random())];
            const groupNode = new f.Node("Group");
            groupNode.addComponent(new f.ComponentTransform());
            const groupComponent = new GantryGlutton.Group();
            groupNode.addComponent(groupComponent);
            const addCustomerPromises = [];
            const createAndAddCustomer = async () => {
                groupComponent.addCustomer(await this.createRandomCustomer());
            };
            for (let i = 0; i < randomGroupSize; i++) {
                addCustomerPromises.push(createAndAddCustomer());
            }
            await Promise.all(addCustomerPromises);
            return groupComponent;
        };
        createRandomCustomer = async () => {
            if (!CustomerQueue.customerGraphResource) {
                CustomerQueue.customerGraphResource = (f.Project.getResourcesByName("Customer")[0]);
            }
            const customerGraphInstance = await f.Project.createGraphInstance(CustomerQueue.customerGraphResource);
            const customer = customerGraphInstance.getComponent(GantryGlutton.Customer);
            customer.setFruitType(GantryGlutton.getRandomFruitType());
            return customer;
        };
        ensureGroupCount = async () => {
            while (this.#groups.length < CustomerQueue.targetGroupCount) {
                const group = await this.createGroup();
                this.#groups.push(group);
                this.node.addChild(group.node);
            }
            this.updateGroupPositions();
        };
        updateGroupPositions = () => {
            for (let i = 0; i < this.#groups.length; i++) {
                const groupNode = this.#groups[i].node;
                const groupTransform = groupNode.getComponent(f.ComponentTransform);
                groupTransform.mtxLocal = f.Matrix4x4.TRANSLATION(f.Vector3.SCALE(CustomerQueue.groupOffset, i));
            }
        };
    }
    GantryGlutton.CustomerQueue = CustomerQueue;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class Fruit extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Fruit);
        static #fallSpeed = 5;
        static #fruitIndicationDuration = 10;
        #modelTransform;
        #shadowTransform;
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
                    this.#modelTransform = this.node.getChildrenByName("Model")[0].getComponent(f.ComponentTransform);
                    this.#shadowTransform = this.node.getChildrenByName("Shadow")[0].getComponent(f.ComponentTransform);
                    this.#shadowTransform.mtxLocal.scaling = f.Vector3.ZERO();
                    break;
            }
        };
        supplyFallDuration = (fallDuration) => {
            const oldModelPosition = this.#modelTransform.mtxLocal.translation;
            oldModelPosition.y = fallDuration * Fruit.#fallSpeed;
            this.#modelTransform.mtxLocal.translation = oldModelPosition;
        };
        update = (_event) => {
            const deltaTime = f.Loop.timeFrameGame / 1000;
            this.#modelTransform.mtxLocal.translateY(-deltaTime * Fruit.#fallSpeed);
            const remainingFallDuration = this.#modelTransform.mtxLocal.translation.y / Fruit.#fallSpeed;
            if (0 < remainingFallDuration && remainingFallDuration < Fruit.#fruitIndicationDuration) {
                this.#shadowTransform.mtxLocal = f.Matrix4x4.SCALING(f.Vector3.ONE(1 - remainingFallDuration / Fruit.#fruitIndicationDuration));
            }
            else {
                this.#shadowTransform.mtxLocal.scaling = f.Vector3.ZERO();
            }
        };
    }
    GantryGlutton.Fruit = Fruit;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class FruitManager extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(FruitManager);
        /**
         * The number of seconds until the first Fruit spawns.
         */
        courseDelay = 1;
        /**
         * The inset for how far off the stage the Fruit spawns.
         */
        courseInset = 1;
        /**
         * The number of Fruits that drop per course.
         */
        fruitCourseLength = 50;
        /**
         * The longest possible interval between Fruit spawning.
         */
        maxFruitInterval = 1;
        /**
         * The shortest possible interval between Fruit spawning.
         */
        minFruitInterval = 0;
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
                    break;
            }
        };
        generateCourse = () => {
            const fruitGraphs = new Map([
                [GantryGlutton.FruitType.Banana, f.Project.getResourcesByName("Banana")[0]],
                [GantryGlutton.FruitType.Blueberry, f.Project.getResourcesByName("Blueberry")[0]],
                [GantryGlutton.FruitType.Cherry, f.Project.getResourcesByName("Cherry")[0]],
                [GantryGlutton.FruitType.Pear, f.Project.getResourcesByName("Pear")[0]],
            ]);
            const stageWidth = 10 - 2 * this.courseInset;
            let timeFromStart = this.courseDelay;
            for (let i = 0; i < this.fruitCourseLength; i++) {
                const fruitFallDuration = timeFromStart;
                const randomFruitType = GantryGlutton.getRandomFruitType();
                const randomPosition = new f.Vector3((Math.random() * stageWidth) + this.courseInset, 0, -(Math.random() * stageWidth) - this.courseInset);
                (async () => {
                    let fruitInstance = await f.Project.createGraphInstance(fruitGraphs.get(randomFruitType));
                    const fruitTransform = fruitInstance.getComponent(f.ComponentTransform);
                    fruitTransform.mtxLocal.translation = randomPosition;
                    const fruitComponent = fruitInstance.getComponent(GantryGlutton.Fruit);
                    fruitComponent.supplyFallDuration(fruitFallDuration);
                    GantryGlutton.graph.addChild(fruitInstance);
                })();
                timeFromStart +=
                    this.maxFruitInterval * Math.random() + this.minFruitInterval;
            }
        };
    }
    GantryGlutton.FruitManager = FruitManager;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    /**
     * Types of fruit.
    */
    let FruitType;
    (function (FruitType) {
        FruitType[FruitType["Banana"] = 0] = "Banana";
        FruitType[FruitType["Blueberry"] = 1] = "Blueberry";
        FruitType[FruitType["Cherry"] = 2] = "Cherry";
        FruitType[FruitType["Pear"] = 3] = "Pear";
    })(FruitType = GantryGlutton.FruitType || (GantryGlutton.FruitType = {}));
    GantryGlutton.getRandomFruitType = () => {
        return Math.floor(4 * Math.random());
    };
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
        #transform;
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
            const oldPosition = this.#transform.mtxLocal.translation;
            oldPosition.x =
                this.platformRigidbody.getPosition().x + this.platformOffset;
            this.#transform.mtxLocal.translation = oldPosition;
        };
        start = (_event) => {
            this.#transform = this.node.getComponent(f.ComponentTransform);
            GantryGlutton.addAfterPhysicsUpdateSubscriber(this);
        };
    }
    GantryGlutton.GantryBridge = GantryBridge;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class Group extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Group);
        static #maxCustomerCount = 3;
        #customers = [];
        static #relativeCustomerPositions = [
            new f.Vector3(0, 0, 0),
            new f.Vector3(-0.5, 0, -0.5),
            new f.Vector3(0.5, 0, -0.5),
            new f.Vector3(0, 0, -1),
        ];
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
                    break;
            }
        };
        addCustomer = (customer) => {
            if (Group.#maxCustomerCount <= this.#customers.length) {
                console.warn("No more customers can be added when the group already contains the max amount, which is ", Group.#maxCustomerCount);
                return;
            }
            const currentCustomerIndex = this.#customers.length;
            this.#customers.push(customer);
            this.node.addChild(customer.node);
            const customerTransform = customer.node.getComponent(f.ComponentTransform);
            customerTransform.mtxLocal = f.Matrix4x4.TRANSLATION(Group.#relativeCustomerPositions[currentCustomerIndex]);
        };
    }
    GantryGlutton.Group = Group;
})(GantryGlutton || (GantryGlutton = {}));
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    //let cmpCamera: f.ComponentCamera;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    const afterPhysicsUpdateSubscribers = [];
    function addAfterPhysicsUpdateSubscriber(subscriber) {
        afterPhysicsUpdateSubscribers.push(subscriber);
    }
    GantryGlutton.addAfterPhysicsUpdateSubscriber = addAfterPhysicsUpdateSubscriber;
    function start(_event) {
        viewport = _event.detail;
        GantryGlutton.graph = viewport.getBranch();
        let referenceCameraObject = GantryGlutton.graph.getChildrenByName("CameraReference")[0];
        viewport.camera.projectCentral(undefined, 60);
        viewport.camera.mtxPivot = referenceCameraObject.getComponent(f.ComponentTransform).mtxLocal;
        const fruitManager = GantryGlutton.graph
            .getChildrenByName("FruitManager")[0]
            .getComponent(GantryGlutton.FruitManager);
        fruitManager.generateCourse();
        const stage = GantryGlutton.graph
            .getChildrenByName("Stage")[0]
            .getComponent(GantryGlutton.Stage);
        stage.generateStage();
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        f.Physics.simulate(); // if physics is included and used
        for (const subscriber of afterPhysicsUpdateSubscribers) {
            subscriber.onAfterPhysicsUpdate();
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
        #rigidbody;
        #initialY;
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
            this.#rigidbody = this.node.getComponent(f.ComponentRigidbody);
            this.#initialY = this.node.getComponent(f.ComponentTransform).mtxLocal.translation.y;
        };
        update = (_event) => {
            //f.Physics.simulate();
            //this.node.dispatchEvent(new Event("SensorHit", {bubbles: true}));
            const inputDirection = this.getInputAsCardinalDirection();
            const gantryBaseActivation = Platform.getGantryBaseActivation(inputDirection);
            const gantryBridgeActivation = Platform.getGantryBridgeActivation(inputDirection);
            this.#rigidbody.applyForce(new f.Vector3(this.motorForce * gantryBaseActivation, 0, -this.motorForce * gantryBridgeActivation));
            const oldPosition = this.#rigidbody.getPosition();
            oldPosition.y = this.#initialY;
            this.#rigidbody.setPosition(oldPosition);
            this.#rigidbody.setRotation(f.Vector3.ZERO());
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
var GantryGlutton;
(function (GantryGlutton) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
    class Stage extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Stage);
        #queueComponents;
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
        generateStage = () => {
            for (const customerQueue of this.#queueComponents) {
                customerQueue.generateQueue();
            }
        };
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
                    this.#queueComponents = ["NE", "SE", "SW", "NW"].map((direction) => {
                        return this.node
                            .getChildrenByName(`CustomerQueue-${direction}`)[0]
                            .getComponent(GantryGlutton.CustomerQueue);
                    });
                    break;
            }
        };
    }
    GantryGlutton.Stage = Stage;
})(GantryGlutton || (GantryGlutton = {}));
//# sourceMappingURL=Script.js.map