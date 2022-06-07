export interface Event {
  name: string;
  event?: string;
  execute(...args: unknown[]): Promise<unknown>;
}
