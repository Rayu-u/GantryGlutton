namespace GantryGlutton {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  //let cmpCamera: f.ComponentCamera;
  let viewport: f.Viewport;
  export let graph: f.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  interface AfterPhysicsBeforeDrawUpdateSubscriber {
    onAfterPhysicsBeforeDrawUpdate: () => void;
  }
  const afterPhysicsBeforeDrawUpdateSubscribers: AfterPhysicsBeforeDrawUpdateSubscriber[] = [];
  export function addAfterPhysicsBeforeDrawUpdateSubscriber(
    subcriber: AfterPhysicsBeforeDrawUpdateSubscriber
  ) {
    afterPhysicsBeforeDrawUpdateSubscribers.push(subcriber);
  }

  interface AfterDrawUpdateSubscriber {
    onAfterDrawUpdate: () => void;
  }
  const afterDrawUpdateSubscribers: AfterDrawUpdateSubscriber[] = [];
  export function addAfterDrawUpdateSubscriber(
    subcriber: AfterDrawUpdateSubscriber
  ) {
    afterDrawUpdateSubscribers.push(subcriber);
  }

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    graph = viewport.getBranch();
    let referenceCameraObject: f.Node =
      graph.getChildrenByName("CameraReference")[0];
    viewport.camera.projectCentral(undefined, 60);

    viewport.camera.mtxPivot = referenceCameraObject.getComponent(
      f.ComponentTransform
    ).mtxLocal;

    const fruitManager: FruitManager = graph.getChildrenByName("FruitManager")[0].getComponent(FruitManager);
    fruitManager.generateCourse();

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    f.Physics.simulate(); // if physics is included and used

    for (const subscriber of afterPhysicsBeforeDrawUpdateSubscribers) {
      subscriber.onAfterPhysicsBeforeDrawUpdate();
    }

    viewport.draw();

    for (const subscriber of afterDrawUpdateSubscribers) {
      subscriber.onAfterDrawUpdate();
    }

    f.AudioManager.default.update();
  }
}
