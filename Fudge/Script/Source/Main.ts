namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  //let cmpCamera: f.ComponentCamera;
  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    //viewport.camera.projectOrthographic();
    //viewport.camera.mtxPivot.translation = new f.Vector3(-15, 12, 15);
    //viewport.camera.mtxPivot.translateX(-15);
    //viewport.camera.mtxPivot.rotation = new f.Vector3(0, 0, 0);
    //viewport.camera.mtxPivot.translateZ(+10);
    //viewport.camera.mtxPivot.rotateY(+30);
    f.Debug.log(viewport.camera);

    //cmpCamera = new f.ComponentCamera();
    
    //cmpCamera.mtxPivot.rotateY(180);
    //cmpCamera.projectOrthographic();
    //viewport.camera.


    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // f.Physics.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();
  }
}