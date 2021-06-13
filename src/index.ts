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
            try {
                const result = await sourceFn(...args)
                this.map.set(key, result)
                return result
            } catch (e){
                this.map.set(key, e)
                throw e
            }
        }
    }
}