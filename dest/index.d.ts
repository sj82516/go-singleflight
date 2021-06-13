export default class SingleFlight {
    private map;
    constructor();
    do(key: string, sourceFn: Function): (...args: any[]) => Promise<any | Function | undefined>;
    forget(key: string): void;
}
