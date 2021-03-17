export class RollbackMigrationCommand {
  public readonly rollback: ReadonlyArray<number>;

  constructor(pk: number);
  constructor(pk: ReadonlyArray<number>);
  constructor(pk: number | ReadonlyArray<number>) {
    this.rollback = Array.isArray(pk) ? [...pk] : [pk];
  }
}
