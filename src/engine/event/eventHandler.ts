
type ThisedFn = <T = any>(this: T, ...args: any[]) => any;

export class EventHandler<T extends {[key: string] : ThisedFn}>{
    handlers: Record<string, Set<ThisedFn>> = {};
    private activeHandlers = 0;

    isActive() {
        return this.activeHandlers > 0;
    }

    on<V extends keyof T>(name: V, cb: T[V]) {
        if (!this.handlers[name as string]) {
            this.handlers[name as string] = new Set();
        }
        this.handlers[name as string].add(cb);
        this.activeHandlers++;
    }

    off<V extends string>(name: V, cb: T[V]) {
        this.handlers[name].delete(cb);
    }

    emit<V extends keyof T>(name: V, ...args: Parameters<T[V]>) {
        if (!this.handlers[name as string]) {
            return;
        }

        for (const cb of this.handlers[name as string]) {
            cb(...args);
        }
    }
}