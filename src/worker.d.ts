interface $worker {
    created(): worker;
    runAll(data?): any;
    terminateAll(): void;
    list(): any;
}

interface worker {
    run(data?): this,
    terminate(): void;
}

export declare function $worker(): $worker;