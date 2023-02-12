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

  /**
   * The specifications of one fruit spawn.
   */
  interface FruitSpawn {
    /**
     * Seconds from course start to this fruit spawns.
     */
    time: number;

    /**
     *The type of fruit to spawn.
     */
    type: FruitType;
  }

  export class Course extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Course);

    /**
     * The number of seconds until the first fruit spawns.
     */
    public courseDelay: number = 1;

    /**
     * The number of fruits that drop per course.
     */
    public fruitCourseLength: number = 50;

    /**
     * The longest possible interval between fruit spawning.
     */
    public maxFruitInterval: number = 1;

    /**
     * The shortest possible interval between fruit spawning.
     */
    public minFruitInterval: number = 0;

    private fruitCourse: FruitSpawn[] = [];

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
          this.generateCourseSpecifications();
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case f.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    };

    private generateCourseSpecifications = () => {
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
}
