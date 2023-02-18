namespace GantryGlutton {
  import f = FudgeCore;

  export class FruitMaterial extends f.ComponentMaterial {
    private fruitType: FruitType;
    constructor() {
      super();

      this.singleton = false;
    }

    public getMutatorAttributeTypes(
      _mutator: f.Mutator
    ): f.MutatorAttributeTypes {
      let types = super.getMutatorAttributeTypes(_mutator);
      if (types.fruitType) {
        types.fruitType = FruitType;
      }
      return types;
    }

    async mutate(_mutator: f.Mutator): Promise<void> {
      if (_mutator.fruitType != undefined) {
        _mutator.fruitType = parseInt(_mutator.fruitType);
      }
      await super.mutate(_mutator);
    }

    protected reduceMutator(_mutator: f.Mutator): void {
      delete _mutator.clrPrimary;
      delete _mutator.clrSecondary;
      delete _mutator.mtxPivot;
      delete _mutator.sortForAlpha;
      delete _mutator.singleton;
    }
  }
}
