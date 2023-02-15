declare namespace GantryGlutton {
    import f = FudgeCore;
    class Cog extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        platformRigidbody: f.ComponentRigidbody;
        platformVelocityDimensionSelector: f.Vector3;
        constructor();
        hndEvent: (_event: Event) => void;
        onAfterPhysicsUpdate: () => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class CustomComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Customer extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        static test: Customer;
        constructor();
        hndEvent: (_event: Event) => void;
        getFruitType: () => FruitType;
        setFruitType: (fruitType: FruitType) => void;
        onAfterPhysicsUpdate: () => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class CustomerQueue extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        static customerGraphResource: f.Graph;
        static targetGroupCount: number;
        /**
         * The offset between groups in local space.
         */
        static readonly betweenGroupOffset: f.Vector3;
        /**
         * The offset between the first group and the position of the queue.
         */
        static readonly firstGroupOffset: f.Vector3;
        constructor();
        generateQueue: () => void;
        hndEvent: (_event: Event) => void;
        private handlePlayerEnterPickupZone;
        private createGroup;
        private createRandomCustomer;
        private ensureGroupCount;
        private updateGroupPosition;
        private updateGroupPositions;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Fruit extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        private fruitType;
        constructor();
        hndEvent: (_event: Event) => void;
        supplyFallDuration: (fallDuration: number) => void;
        private handlePlayerEnterFruit;
        private setShadowScale;
        private update;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
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
    /**
     * Types of fruit.
    */
    enum FruitType {
        Banana = 0,
        Blueberry = 1,
        Cherry = 2,
        Pear = 3
    }
    const getRandomFruitType: () => FruitType;
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
        #private;
        static readonly iSubclass: number;
        platformOffset: number;
        platformRigidbody: f.ComponentRigidbody;
        constructor();
        hndEvent: (_event: Event) => void;
        onAfterPhysicsUpdate: () => void;
        start: (_event: Event) => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Group extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        customers: Customer[];
        constructor();
        hndEvent: (_event: Event) => void;
        addCustomer: (customer: Customer) => void;
        moveTo: (localTargetPosition: f.Vector3, instant: boolean) => void;
        private update;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    export let graph: f.Node;
    interface AfterPhysicsUpdateSubscriber {
        onAfterPhysicsUpdate: () => void;
    }
    export function addAfterPhysicsUpdateSubscriber(subscriber: AfterPhysicsUpdateSubscriber): void;
    export {};
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class PlatformInteractions extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        constructor();
        getEmptySpots: () => number;
        handleHitFruit: (fruitType: FruitType) => void;
        hndEvent: (_event: Event) => void;
        seatCustomers: (customers: Customer[]) => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class PlatformMovement extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        /**
         *
         * Classify the supplied direction into positive, negative or neutral in the form of a number.
         *
         * @param direction The direction that should be classified.
         * @param positiveGroup The group of positive directions.
         * @param negativeGroup The group of negative directions.
         * @returns The group that the supplied direction was in in the form of a number.
         */
        private static classifyCardinalDirection;
        private static getGantryBaseDirection__positiveGroup;
        private static getGantryBaseDirection__negativeGroup;
        /**
         * Get the activation direction of the gantry base motor.
         *
         * @param inputDirection The direction of the input.
         * @returns The activation direction of the gantry base.
         */
        private static getGantryBaseActivation;
        private static getGantryBridgeDirection__positiveGroup;
        private static getGantryBridgeDirection__negativeGroup;
        /**
         * Get the activation direction of the gantry bridge motor.
         *
         * @param inputDirection The direction of the input.
         * @returns The activation direction of the gantry bridge.
         */
        private static getGantryBridgeActivation;
        motorForce: number;
        constructor();
        hndEvent: (_event: Event) => void;
        /**
         * Get the cardinal direction of current WASD or arrow input.
         *
         * @returns The cardinal direction of current WASD or arrow input.
         */
        private getInputAsCardinalDirection;
        private update;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Stage extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        constructor();
        generateStage: () => void;
        hndEvent: (_event: Event) => void;
    }
}
