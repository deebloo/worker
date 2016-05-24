interface $worker {
    create(fn: Function): Worker;
    runAll(data?): PromiseLike<any>;
    terminateAll(): void;
    list(): any;
}

export interface Worker {
    run(data?): PromiseLike<any>,
    terminate(): void;
}

export declare function $worker(): $worker;