namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class PlatformInteractions extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(PlatformInteractions);

    static readonly #screamSoundChance = 1 / 15;
    static readonly #spotPositions: f.Vector3[] = [
      new f.Vector3(0.5, 0, -0.5),
      new f.Vector3(1.5, 0, -0.5),
      new f.Vector3(0.5, 0, -1.5),
      new f.Vector3(1.5, 0, -1.5),
    ];

    readonly #spots: Customer[] = [null, null, null, null];

    #pointSoundComponent: f.ComponentAudio;
    #refillSoundComponent: f.ComponentAudio;
    #screamSoundComponent: f.ComponentAudio;

    #scoreModel: ScoreUi;

    /**
     * An array with indices that's shuffled before random iterations.
     */
    readonly #spotIndices = [0, 1, 2, 3];

    constructor() {
      super();

      // Don't start when running in editor
      if (f.Project.mode == f.MODE.EDITOR) return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(f.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public getEmptySpots = (): number => {
      return this.#spots.filter((item) => !item).length;
    };

    public handleHitFruit = (fruitType: FruitType): void => {
      // Random iteration
      // Associated random numbers
      const associatedRandomNumbers: number[] = this.#spotIndices.map(
        Math.random
      );
      this.#spotIndices.sort(
        (a, b) => associatedRandomNumbers[a] - associatedRandomNumbers[b]
      );

      // Look for customer with correct fruit type
      for (const spotIndex of this.#spotIndices) {
        const customer: Customer = this.#spots[spotIndex];
        if (!customer || customer.getFruitType() != fruitType) {
          continue;
        }

        // Customer found with correct fruit type
        this.#spots[spotIndex] = null;
        customer.detach();
        this.#scoreModel.score++;
        this.playPointSound();
        break;
      }
    };

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
          const audioListener = this.node.getComponent(
            f.ComponentAudioListener
          );
          f.AudioManager.default.listenWith(audioListener);

          this.#pointSoundComponent = this.node
            .getChildrenByName("PointSound")[0]
            .getComponent(f.ComponentAudio);
          this.#refillSoundComponent = this.node
            .getChildrenByName("RefillSound")[0]
            .getComponent(f.ComponentAudio);
          this.#screamSoundComponent = this.node
            .getChildrenByName("ScreamSound")[0]
            .getComponent(f.ComponentAudio);

          this.#scoreModel = new ScoreUi();
          break;
      }
    };

    public seatCustomers = (customers: Customer[]): void => {
      if (this.getEmptySpots() < customers.length) {
        return;
      }

      this.#refillSoundComponent.play(true);

      for (const customer of customers) {
        let randomSpotIndex: number;
        do {
          randomSpotIndex = Math.floor(4 * Math.random());
        } while (this.#spots[randomSpotIndex]); // Continue while the spot is occupied (not null)

        // A spot without a customer must have been found.
        this.#spots[randomSpotIndex] = customer;
        this.node.addChild(customer.node);
        const customerTransform = customer.node.getComponent(
          f.ComponentTransform
        );
        customerTransform.mtxLocal.translation =
          PlatformInteractions.#spotPositions[randomSpotIndex];
      }
    };

    private playPointSound = () => {
      if (Math.random() < PlatformInteractions.#screamSoundChance) {
        this.#screamSoundComponent.play(true);
      } else {
        this.#pointSoundComponent.play(true);
      }
    };
  }
}
