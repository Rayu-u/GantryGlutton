declare namespace GantryGlutton {
    import f = FudgeCore;
    class Cog extends f.ComponentScript {
        static readonly iSubclass: number;
        platformRigidbody: f.ComponentRigidbody;
        private transform;
        platformVelocityDimensionSelector: f.Vector3;
        constructor();
        hndEvent: (_event: Event) => void;
        onAfterPhysicsUpdate: () => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Course extends f.ComponentScript {
        static readonly iSubclass: number;
        /**
         * The number of seconds until the first fruit spawns.
         */
        courseDelay: number;
        /**
         * The longest possible interval between fruit spawning.
         */
        maxFruitInterval: number;
        /**
         * The shortest possible interval between fruit spawning.
         */
        minFruitInterval: number;
        /**
         * The number of fruits that drop per course.
         */
        fruitCourseLength: number;
        private fruitCourse;
        constructor();
        hndEvent: (_event: Event) => void;
        private generateCourseSpecifications;
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
        onAfterPhysicsUpdate: () => void;
        start: (_event: Event) => void;
    }
}
declare namespace GantryGlutton {
    interface AfterPhysicsUpdateSubscriber {
        onAfterPhysicsUpdate: () => void;
    }
    export function addAfterPhysicsUpdateSubscriber(subcriber: AfterPhysicsUpdateSubscriber): void;
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
