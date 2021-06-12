export default class SingleFlight {
    private map: Map<string, Function>;

    constructor() {
        this.map = new Map()
    }

    do(key: string, sourceFn: Function): (...args: any[]) => Promise<any | Function | undefined> {
        return async (...args) => {
            const runningFn = this.map.get(key)
            if (runningFn) {
                return runningFn;
            }
            this.map.set(key, await sourceFn(...args))
            return this.map.get(key)
        }
    }
}