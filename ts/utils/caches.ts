export class Caches {
  readonly capacity: number = 1000
  private caches: Map<string, string> = new Map<string, string>()
  private keys: string[] = []

  constructor(capacity?: number) {
    if (capacity) this.capacity = capacity
  }

  public has(key: string): boolean {
    return this.caches.has(key)
  }

  public get(key: string): string | undefined {
    return this.caches.get(key)
  }

  public delete(key: string, pos?: number): void {
    this.caches.delete(key)
    if (pos) this.keys.splice(pos, 1)
    else this.keys.splice(this.keys.indexOf(key), 1)
  }

  private simpleAdd(key: string, value: string): void {
    this.caches.set(key, value)
    this.keys.push(key)
  }

  private deleteOldest(): void {
    this.delete(this.keys[0], 0)
  }

  public add(key: string, value: string): void {
    // The values are defined by the keys
    if (this.caches.has(key)) return
    else if (this.keys.length === this.capacity) this.deleteOldest()

    this.simpleAdd(key, value)
  }
}
