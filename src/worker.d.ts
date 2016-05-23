interface $worker {
    created(): worker;
    runAll(): any;
    terminateAll(): void;
    list(): any;
}

interface worker {
    run(data?): this,
    terminate: void;
}