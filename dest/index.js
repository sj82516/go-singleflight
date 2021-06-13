"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class SingleFlight {
    constructor() {
        this.map = new Map();
    }
    do(key, sourceFn) {
        return (...args) => __awaiter(this, void 0, void 0, function* () {
            const runningFn = this.map.get(key);
            console.log(runningFn)
            if (runningFn) {
                return runningFn;
            }
            try {
                this.map.set(key, sourceFn(...args));
                return yield this.map.get(key);
            }
            catch (e) {
                this.map.set(key, e);
                throw e;
            }
            finally {
                this.map.delete(key);
            }
        });
    }
    forget(key) {
        this.map.delete(key);
    }
}
exports.default = SingleFlight;
//# sourceMappingURL=index.js.map