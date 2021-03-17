import * as validator from 'class-validator';
import { Model } from './model';

describe('Model', () => {
  class TestA extends Model<TestA> {
    @validator.IsNotEmpty()
    @validator.IsString()
    readonly nonEmpty: string;

    @validator.IsOptional()
    @validator.IsNumber()
    @validator.Min(1)
    readonly positiveNumber?: number;

    toString = () => 'TestModel';
  }

  it('updates fields', () => {
    const a = new TestA({ nonEmpty: 'hello' });
    const b = a.update({ positiveNumber: 1 });

    expect(b).toMatchObject<Partial<TestA>>({
      nonEmpty: 'hello',
      positiveNumber: 1,
    });
  });

  it('creates a copy during update', () => {
    const a = new TestA({ nonEmpty: 'hello' });
    const b = a.update({ positiveNumber: 1 });
    expect(a).not.toBe(b);
  });

  it('validates created and updated objects', async () => {
    const a = new TestA({ nonEmpty: 'hello' });
    const b = a.update({ positiveNumber: 0 });
    const resultA = await validator.validate(a);
    const resultB = await validator.validate(b);
    expect(resultA).toHaveLength(0);
    expect(resultB.length).toBeGreaterThan(0);
  });

  it('updates with each chained operation', async () => {
    const data = new TestA({ nonEmpty: 'hello' })
      .update({ positiveNumber: 0 })
      .update({ nonEmpty: 'world', positiveNumber: 10 })
      .update({ nonEmpty: null });

    const result = await validator.validate(data);

    expect(result.length).toBeGreaterThan(0);
    expect(data).toMatchObject<Partial<TestA>>({
      nonEmpty: null,
      positiveNumber: 10,
    });
  });
});
