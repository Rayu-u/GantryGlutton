namespace GantryGlutton {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(GantryGlutton); // Register the namespace to FUDGE for serialization

  export class SimpleAudioListener extends f.ComponentAudioListener {
    protected reduceMutator(_mutator: f.Mutator): void {
      super.reduceMutator(_mutator);

      delete _mutator.mtxPivot;
    }
  }
}
