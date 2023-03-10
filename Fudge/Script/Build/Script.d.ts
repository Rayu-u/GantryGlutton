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
    interface ConfigField<T> {
        description: string;
        value: T;
    }
    export interface Config {
        courseDelay: ConfigField<number>;
        courseLength: ConfigField<number>;
        maxFruitInterval: ConfigField<number>;
        minFruitInterval: ConfigField<number>;
        queueSize: ConfigField<number>;
    }
    export {};
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
        detach: () => Promise<void>;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class CustomerQueue extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        static customerGraphResource: f.Graph;
        /**
         * The offset between groups in local space.
         */
        static readonly betweenGroupOffset: f.Vector3;
        /**
         * The offset between the first group and the position of the queue.
         */
        static readonly firstGroupOffset: f.Vector3;
        constructor();
        generateQueue: (config: Config) => void;
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
        #private;
        static readonly iSubclass: number;
        /**
         * The inset for how far off the stage the Fruit spawns.
         */
        courseInset: number;
        constructor();
        hndEvent: (_event: Event) => void;
        generateCourse: (config: Config) => void;
        private startProgressCounter;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class FruitMaterial extends f.ComponentMaterial {
        private fruitType;
        constructor();
        getMutatorAttributeTypes(_mutator: f.Mutator): f.MutatorAttributeTypes;
        mutate(_mutator: f.Mutator): Promise<void>;
        protected reduceMutator(_mutator: f.Mutator): void;
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
        private playPointSound;
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
    class ProgressUi extends f.Mutable {
        timeRemaining: string;
        constructor();
        protected reduceMutator(_mutator: f.Mutator): void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class ScoreUi extends f.Mutable {
        score: number;
        constructor();
        protected reduceMutator(_mutator: f.Mutator): void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class SimpleAudioListener extends f.ComponentAudioListener {
        protected reduceMutator(_mutator: f.Mutator): void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Stage extends f.ComponentScript {
        #private;
        static readonly iSubclass: number;
        constructor();
        generateStage: (config: Config) => void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace GantryGlutton {
    import f = FudgeCore;
    class Trapdoor extends f.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
