namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization
  
  /**
   * Types of fruit.
  */
 export enum FruitType {
   Banana,
   Blueberry,
   Cherry,
   Pear,
  }

  export class FruitManager extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
    f.Component.registerSubclass(FruitManager);

    /**
     * The number of seconds until the first Fruit spawns.
     */
    public courseDelay: number = 1;

    /**
     * The inset for how far off the stage the Fruit spawns.
     */
    public courseInset: number = 1;

    /**
     * The number of Fruits that drop per course.
     */
    public fruitCourseLength: number = 50;

    /**
     * The longest possible interval between Fruit spawning.
     */
    public maxFruitInterval: number = 1;

    /**
     * The shortest possible interval between Fruit spawning.
     */
    public minFruitInterval: number = 0;
  
    
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
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case f.EVENT.NODE_DESERIALIZED:
          break;
      }
    };

    public generateCourse = () => {
      const fruitGraphs: Map<FruitType, f.Graph> = new Map<FruitType, f.Graph>([
        [FruitType.Banana,<f.Graph>f.Project.getResourcesByName("Banana")[0]],
        [FruitType.Blueberry,<f.Graph>f.Project.getResourcesByName("Blueberry")[0]],
        [FruitType.Cherry,<f.Graph>f.Project.getResourcesByName("Cherry")[0]],
        [FruitType.Pear,<f.Graph>f.Project.getResourcesByName("Pear")[0]],
      ]);

      const stageWidth: number = 10 - 2 * this.courseInset;
      let timeFromStart = this.courseDelay;
      for (let i = 0; i < this.fruitCourseLength; i++) {
        const fruitFallDuration = timeFromStart;
        const randomFruit = Math.floor(4 * Math.random());
        const randomPosition: f.Vector3 = new f.Vector3(
          (Math.random() * stageWidth) + this.courseInset,
          0,
          -(Math.random() * stageWidth) - this.courseInset
        );

        (async () => {        
          let fruitInstance: f.GraphInstance = await f.Project.createGraphInstance(
            fruitGraphs.get(randomFruit)
          );
          
          const fruitTransform: f.ComponentTransform = fruitInstance.getComponent(f.ComponentTransform);
          fruitTransform.mtxLocal.translation = randomPosition;
          
          const fruitComponent: Fruit = fruitInstance.getComponent(Fruit);
          fruitComponent.supplyFallDuration(fruitFallDuration);

          graph.addChild(fruitInstance);
        })();

        timeFromStart +=
          this.maxFruitInterval * Math.random() + this.minFruitInterval;
      }
    };
  }
}
