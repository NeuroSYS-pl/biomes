export class ApplyMigrationCommand {
  public readonly pending: ReadonlyArray<number>;

  constructor(pk: number);
  constructor(pk: ReadonlyArray<number>);
  constructor(pk: number | ReadonlyArray<number>) {
    this.pending = Array.isArray(pk) ? [...pk] : [pk];
  }
}
