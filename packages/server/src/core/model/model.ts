import { plainToClassFromExist } from 'class-transformer';

export abstract class Model<E> {
  constructor(data: Omit<E, keyof Model<unknown>>) {
    Object.assign(this, plainToClassFromExist(this, data));
  }

  abstract toString(): string;

  update(data: Partial<Omit<E, keyof Model<unknown>>>): this {
    const copy: E = Object.create(Object.getPrototypeOf(this));
    return Object.assign(copy, this, data);
  }
}
