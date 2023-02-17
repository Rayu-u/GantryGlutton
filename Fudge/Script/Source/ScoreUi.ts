namespace GantryGlutton {
  import f = FudgeCore;
  import fui = FudgeUserInterface;

  export class ScoreUi extends f.Mutable {
    public score: number = 0;

    constructor() {
      super();
      const scoreDisplay: HTMLElement =
        document.querySelectorAll<HTMLElement>("#score-container")[0];
      const endScreen: HTMLElement =
        document.querySelectorAll<HTMLElement>("#end-screen")[0];
      new fui.Controller(this, scoreDisplay);
      new fui.Controller(this, endScreen);
    }

    protected reduceMutator(_mutator: f.Mutator): void {}
  }
}
