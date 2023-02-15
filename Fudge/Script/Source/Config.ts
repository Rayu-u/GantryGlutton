namespace GantryGlutton {
  interface ConfigField<T> {
    description: string;
    value: T;
  }

  export interface Config {
    courseDelay: ConfigField<number>;
    courseLength: ConfigField<number>;
    maxFruitInterval: ConfigField<number>;
    minFruitInterval: ConfigField<number>;
    queueSize: ConfigField<number>;
  }
}
