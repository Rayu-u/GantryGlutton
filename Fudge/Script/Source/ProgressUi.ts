namespace GantryGlutton {
  import f = FudgeCore;
  import fui = FudgeUserInterface;

  export class ProgressUi extends f.Mutable {
    public timeRemaining: string;

    constructor() {
      super();
      const progressDisplay: HTMLElement =
        document.querySelectorAll<HTMLElement>("#progress-container")[0];
      new fui.Controller(this, progressDisplay);
    }

    protected reduceMutator(_mutator: f.Mutator): void {}
  }
}
