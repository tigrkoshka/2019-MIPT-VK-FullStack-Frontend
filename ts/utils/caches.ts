export class Caches<T> {
  private caches: Map<string, T> = new Map<string, T>()
  private keys: string[] = []

  constructor(public readonly capacity: number = 1000) {}

  public has(key: string): boolean {
    return this.caches.has(key)
  }

  public get(key: string): T | undefined {
    return this.caches.get(key)
  }

  public delete(key: string, pos?: number): void {
    this.caches.delete(key)
    const position: number = pos || this.keys.indexOf(key)
    this.keys.splice(position, 1)
  }

  private simpleAdd(key: string, value: T): void {
    this.caches.set(key, value)
    this.keys.push(key)
  }

  private deleteOldest(count: number = 1): void {
    for (let i: number = 1; i <= count; i++) this.delete(this.keys[0], 0)
  }

  public add(key: string, value: T): void {
    // The values are defined by the keys
    if (this.caches.has(key)) return
    else if (this.keys.length >= this.capacity) this.deleteOldest(this.keys.length - this.capacity + 1)

    this.simpleAdd(key, value)
  }
}
