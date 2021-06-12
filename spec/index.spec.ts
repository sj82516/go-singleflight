import 'jest'
import SingleFlight from "../src";

describe('SingleFlight', () => {
    let singleFlight: SingleFlight
    beforeEach(() => {
        singleFlight = new SingleFlight()
    })
    it('should only call source once under SingleFlight.do protection', async function () {
        const result = "hello singleflight"
        let sourceFn = jest.fn(() => {
            return new Promise((res, rej) => {
                setTimeout(() => res(result), 1000)
            })
        })
        let protectFn = singleFlight.do('key', sourceFn)
        let returnValue = null;
        for (let i = 0; i < 10; i++) {
            returnValue = await protectFn()
        }
        expect(sourceFn.mock.calls.length).toBe(1)
        expect(returnValue).toBe(result)
    });
    it('make sure the params are pass in', async function () {
        const params = 'test'
        const expectResult = 'test, singleflight'
        let sourceFn = jest.fn((input) => {
            return new Promise((res, rej) => {
                setTimeout(() => res(`${input}, singleflight`), 1000)
            })
        })
        let protectFn = singleFlight.do('key', sourceFn)
        let returnValue = null;
        for (let i = 0; i < 10; i++) {
            returnValue = await protectFn(params)
        }
        expect(sourceFn.mock.calls.length).toBe(1)
        expect(returnValue).toBe(expectResult)
    });
})
