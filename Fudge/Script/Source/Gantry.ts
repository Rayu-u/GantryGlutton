namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class Gantry extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      f.Component.registerSubclass(Gantry);

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
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          this.start(_event);
          break;
      }
    };

    public start = (_event: Event): void => {
      let platformRigidbody: f.ComponentRigidbody = this.node
        .getChildrenByName("Platform")[0]
        .getComponent(f.ComponentRigidbody);

      this.node
        .getChildrenByName("Bridge")[0]
        .getComponent(GantryBridge).platformRigidbody = platformRigidbody;
      this.node
        .getChildrenByName("Base")[0]
        .getChildrenByName("Cog")[0]
        .getComponent(Cog).platformRigidbody = platformRigidbody;
      this.node
        .getChildrenByName("Bridge")[0]
        .getChildrenByName("Cog")[0]
        .getComponent(Cog).platformRigidbody = platformRigidbody;
    };
  }
}
