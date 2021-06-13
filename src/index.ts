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
                this.map.set(key, sourceFn(...args))
                return await this.map.get(key)
            } catch (e){
                this.map.set(key, e)
                throw e
            }
        }
    }

    forget(key: string) {
        this.map.delete(key)
    }
}