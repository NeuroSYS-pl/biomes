import { EnumMapper } from './enum-mapper';
import { KeyError } from './key-error';

describe('EnumMapper', () => {
  enum A {
    BEGIN = 'a:begin',
    RUN = 'a:run',
    END = 'a:end',
  }

  enum B {
    begin = 'b:begin',
    run = 'b:run',
    end = 'b:end',
  }

  it('creates mappings', () => {
    const mapper = new EnumMapper<A, B>([
      [A.BEGIN, B.begin],
      [A.RUN, B.run],
      [A.END, B.end],
    ]);

    expect(mapper).toBeDefined();
  });

  it('maps forward values', () => {
    const mapper = new EnumMapper<A, B>([
      [A.BEGIN, B.begin],
      [A.RUN, B.run],
      [A.END, B.end],
    ]);

    expect(mapper.forward(A.BEGIN)).toBe(B.begin);
    expect(mapper.forward(A.BEGIN)).not.toBe(B.run);
    expect(mapper.forward(A.BEGIN)).not.toBe(B.end);

    expect(mapper.forward(A.RUN)).not.toBe(B.begin);
    expect(mapper.forward(A.RUN)).toBe(B.run);
    expect(mapper.forward(A.RUN)).not.toBe(B.end);

    expect(mapper.forward(A.END)).not.toBe(B.begin);
    expect(mapper.forward(A.END)).not.toBe(B.run);
    expect(mapper.forward(A.END)).toBe(B.end);
  });

  it('maps backward values', () => {
    const mapper = new EnumMapper<A, B>([
      [A.BEGIN, B.begin],
      [A.RUN, B.run],
      [A.END, B.end],
    ]);

    expect(mapper.backward(B.begin)).toBe(A.BEGIN);
    expect(mapper.backward(B.begin)).not.toBe(A.RUN);
    expect(mapper.backward(B.begin)).not.toBe(A.END);

    expect(mapper.backward(B.run)).not.toBe(A.BEGIN);
    expect(mapper.backward(B.run)).toBe(A.RUN);
    expect(mapper.backward(B.run)).not.toBe(A.END);

    expect(mapper.backward(B.end)).not.toBe(A.BEGIN);
    expect(mapper.backward(B.end)).not.toBe(A.RUN);
    expect(mapper.backward(B.end)).toBe(A.END);
  });

  it('fails for invalid keys', () => {
    const mapper = new EnumMapper<A, B>([
      [A.BEGIN, B.begin],
      [A.END, B.end],
    ]);

    expect(() => mapper.forward(A.RUN)).toThrowError(KeyError);
    expect(() => mapper.backward(B.run)).toThrowError(KeyError);
  });
});
