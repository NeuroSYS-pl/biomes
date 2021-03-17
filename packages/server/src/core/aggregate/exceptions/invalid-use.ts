export class AggregateInvalidState extends Error {
  constructor() {
    super("Aggregate's Model is in an invalid state!");
  }
}
