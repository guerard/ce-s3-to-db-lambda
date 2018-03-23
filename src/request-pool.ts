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
      if ((this.currentIndex % this.poolSize) === 0) {
        this.currentIndex = 0;
      }
      const next = this.currentIndex++;
      this.pool[next] = this.pool[next].then(() => {
        return callable().then(resolve, reject);
      });
    });
  }
}