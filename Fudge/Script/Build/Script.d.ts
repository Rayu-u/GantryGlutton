declare namespace GantryGlutton {
    import f = FudgeCore;
    class Cog extends f.ComponentScript {
        static readonly iSubclass: number;
        platformRigidbody: f.ComponentRigidbody;
        private transform;
        platformVelocityDimensionSelector: f.Vector3;
        constructor();
        hndEvent: (_event: Event) => void;
        onAfterPhysicsBeforeDrawUpdate: () => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Customer extends f.ComponentScript {
        static readonly iSubclass: number;
        private rigidbody;
        private modelRigidbody;
        private modelPositionBuffer;
        private test;
        constructor();
        hndEvent: (_event: Event) => void;
        onAfterPhysicsBeforeDrawUpdate: () => void;
        onAfterDrawUpdate: () => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class CustomerManager extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Fruit extends f.ComponentScript {
        static readonly iSubclass: number;
        private static fallSpeed;
        private static fruitIndicationDuration;
        private modelTransform;
        private shadowTransform;
        constructor();
        hndEvent: (_event: Event) => void;
        supplyFallDuration: (fallDuration: number) => void;
        update: (_event: Event) => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    /**
     * Types of fruit.
    */
    enum FruitType {
        Banana = 0,
        Blueberry = 1,
        Cherry = 2,
        Pear = 3
    }
    class FruitManager extends f.ComponentScript {
        static readonly iSubclass: number;
        /**
         * The number of seconds until the first Fruit spawns.
         */
        courseDelay: number;
        /**
         * The inset for how far off the stage the Fruit spawns.
         */
        courseInset: number;
        /**
         * The number of Fruits that drop per course.
         */
        fruitCourseLength: number;
        /**
         * The longest possible interval between Fruit spawning.
         */
        maxFruitInterval: number;
        /**
         * The shortest possible interval between Fruit spawning.
         */
        minFruitInterval: number;
        constructor();
        hndEvent: (_event: Event) => void;
        generateCourse: () => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Gantry extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        start: (_event: Event) => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class GantryBridge extends f.ComponentScript {
        static readonly iSubclass: number;
        platformOffset: number;
        platformRigidbody: f.ComponentRigidbody;
        private transform;
        constructor();
        hndEvent: (_event: Event) => void;
        onAfterPhysicsBeforeDrawUpdate: () => void;
        start: (_event: Event) => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    export let graph: f.Node;
    interface AfterPhysicsBeforeDrawUpdateSubscriber {
        onAfterPhysicsBeforeDrawUpdate: () => void;
    }
    export function addAfterPhysicsBeforeDrawUpdateSubscriber(subcriber: AfterPhysicsBeforeDrawUpdateSubscriber): void;
    interface AfterDrawUpdateSubscriber {
        onAfterDrawUpdate: () => void;
    }
    export function addAfterDrawUpdateSubscriber(subcriber: AfterDrawUpdateSubscriber): void;
    export {};
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    type CardinalDirection = "" | "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
    export class Platform extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        motorForce: number;
        private rigidbody;
        private initialY;
        constructor();
        hndEvent: (_event: Event) => void;
        start: (_event: Event) => void;
        update: (_event: Event) => void;
        /**
         * Get the cardinal direction of current WASD or arrow input.
         *
         * @returns The cardinal direction of current WASD or arrow input.
         */
        getInputAsCardinalDirection(): CardinalDirection;
        static getGantryBaseDirection__positiveGroup: CardinalDirection[];
        static getGantryBaseDirection__negativeGroup: CardinalDirection[];
        /**
         * Get the activation direction of the gantry base motor.
         *
         * @param inputDirection The direction of the input.
         * @returns The activation direction of the gantry base.
         */
        static getGantryBaseActivation(inputDirection: CardinalDirection): number;
        static getGantryBridgeDirection__positiveGroup: CardinalDirection[];
        static getGantryBridgeDirection__negativeGroup: CardinalDirection[];
        /**
         * Get the activation direction of the gantry bridge motor.
         *
         * @param inputDirection The direction of the input.
         * @returns The activation direction of the gantry bridge.
         */
        static getGantryBridgeActivation(inputDirection: CardinalDirection): number;
        /**
         *
         * Classify the supplied direction into positive, negative or neutral in the form of a number.
         *
         * @param direction The direction that should be classified.
         * @param positiveGroup The group of positive directions.
         * @param negativeGroup The group of negative directions.
         * @returns The group that the supplied direction was in in the form of a number.
         */
        static classifyCardinalDirection(direction: CardinalDirection, positiveGroup: CardinalDirection[], negativeGroup: CardinalDirection[]): number;
    }
    export {};
}
