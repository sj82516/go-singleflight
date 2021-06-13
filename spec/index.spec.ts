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
        let promiseList = []
        for (let i = 0; i < 10; i++) {
            promiseList.push(protectFn())
        }
        await Promise.all(promiseList)
        expect(sourceFn.mock.calls.length).toBe(1)
    });

    it('make sure the params are pass in', async function () {
        let sourceFn = jest.fn((input) => {
            return new Promise((res, rej) => {
                setTimeout(() => res(input), 1000)
            })
        })
        let protectFn = singleFlight.do('key', sourceFn)
        let promiseList = []
        for (let i = 0; i < 10; i++) {
            promiseList.push(protectFn(i))
        }
        const resultList = await Promise.all(promiseList)
        expect(sourceFn.mock.calls.length).toBe(1)
        expect(resultList.every(v => v === 0)).toBeTruthy()
    });

    it('make sure error throw out', async function () {
        let sourceFn = jest.fn(() => {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    rej("error")
                }, 1000)
            })
        })
        let protectFn = singleFlight.do('key', sourceFn)
        const promiseList = []
        for (let i = 0; i < 10; i++) {
            promiseList.push(protectFn())
        }
        expect(sourceFn.mock.calls.length).toBe(1)
        try {
            await Promise.all(promiseList)
        } catch (e) {
            expect(e).toBe('error')
        }
    });

    it('should get new value if forget', async function () {
        let sourceFn = jest.fn((result) => {
            return new Promise((res, rej) => {
                setTimeout(() => res(result), 1000)
            })
        })
        let protectFn = singleFlight.do('key', sourceFn)
        let promiseList = []
        for (let i = 0; i < 10; i++) {
            promiseList.push(protectFn(i))
        }
        const newValue = 'test'
        await new Promise((res) =>
            setTimeout(() => {
                singleFlight.forget('key')
                promiseList.push(protectFn(newValue))
                res(null)
            }, 300)
        )
        const resultList = await Promise.all(promiseList)
        expect(sourceFn.mock.calls.length).toBe(2)
        expect(resultList.slice(-1)[0]).toBe(newValue)
    });
})