import { noop } from 'lodash';

export default class RequestPool {
  private currentIndex = 0;
  private pool: Promise<any>[] = [];
  constructor(private poolSize: number) {
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(Promise.resolve());
    }
  }

  public submit<O>(callable: () => Promise<O>): Promise<O> {
    return new Promise((resolve, reject) => {
      this.selectPromise().then(() => {
        const work = callable();
        work.then(resolve, reject);
        return work.then(noop, noop);
      });
    });
  }

  /**
   * Override this to supply your own strategy for choosing which promise to attach
   * the incoming one onto. Currently just does a dumb round-robin, which is fine for
   * 99% of use-cases.
   */
  protected selectPromise() {
    const promise = this.pool[this.currentIndex++ % this.poolSize];
    if ((this.currentIndex % this.poolSize) === 0) {
      // reset the counter; this ensures we don't increment beyond the range
      // of valid integers in JS numbers (assuming poolSize is less than Number.MAX_SAFE_INTEGER)
      this.currentIndex = 0;
    }
    return promise;
  }
}