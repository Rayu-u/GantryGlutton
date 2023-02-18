namespace GantryGlutton {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  //let cmpCamera: f.ComponentCamera;
  let viewport: f.Viewport;
  export let graph: f.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  interface AfterPhysicsUpdateSubscriber {
    onAfterPhysicsUpdate: () => void;
  }
  const afterPhysicsUpdateSubscribers: AfterPhysicsUpdateSubscriber[] = [];
  export function addAfterPhysicsUpdateSubscriber(
    subscriber: AfterPhysicsUpdateSubscriber
  ) {
    afterPhysicsUpdateSubscribers.push(subscriber);
  }

  const init = async () => {
    const configResponse = await fetch("config.json");
    const config = (await configResponse.json()) as Config;

    let referenceCameraObject: f.Node =
      graph.getChildrenByName("CameraReference")[0];
    viewport.camera.projectCentral(undefined, 60);
    viewport.camera.mtxPivot = referenceCameraObject.getComponent(
      f.ComponentTransform
    ).mtxLocal;

    const fruitManager: FruitManager = graph
      .getChildrenByName("FruitManager")[0]
      .getComponent(FruitManager);
    fruitManager.generateCourse(config);
    const stage: Stage = graph
      .getChildrenByName("Stage")[0]
      .getComponent(Stage);
    stage.generateStage(config);

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  };

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();

    // Logic when game ends.
    graph.addEventListener("gamefinish", () => {
      document.body.classList.add("finished");
      document.body.addEventListener("click", () => location.reload());
    });

    init();
  }

  function update(_event: Event): void {
    f.Physics.simulate(); // if physics is included and used

    for (const subscriber of afterPhysicsUpdateSubscribers) {
      subscriber.onAfterPhysicsUpdate();
    }

    viewport.draw();
    f.AudioManager.default.update();
  }
}
