interface $worker {
    create(fn: Function, otherScripts?: [{name: string, method: Function}]): Worker;
    runAll(data?): PromiseLike<any>;
    terminateAll(): void;
    list(): any;
}

export interface Worker {
    run(data?): PromiseLike<any>,
    terminate(): void;
}

export declare function $worker(): $worker;
