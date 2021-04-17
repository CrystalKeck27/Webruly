declare type ListenerSignature<L> = {
    [E in keyof L]: (...args: any[]) => any;
};

declare type DefaultListener = {
    [k: string]: (...args: any[]) => any;
};

declare type ListenerList<L> = {
    [E in keyof L]: ((...args: any[]) => any)[];
}

declare type DefaultListenerList = {
    [k: string]: ((...args: any[]) => any)[];
}

class EventEmitter<L extends ListenerSignature<L> = DefaultListener> {
    //Giving this a type is really freakin' hard.
    #listeners: any;

    constructor() {
        this.#listeners = {};
    }

    removeAllListeners(event?: keyof L): this{
        this.#listeners[event] = [];
        return this;
    };

    on<U extends keyof L>(event: U, listener: L[U]): this {
        if(!this.#listeners[event]) this.#listeners[event] = [];
        this.#listeners[event].push(listener);
        return this;
    };

    off<U extends keyof L>(event: U, listener: L[U]): this{
        if(!this.#listeners[event]) this.#listeners[event] = [];
        while (true) {
            let index = this.#listeners[event].indexOf(listener);
            if (index == -1) break;
            this.#listeners[event].splice(index, 1);
        }
        return this;
    };

    emit<U extends keyof L>(event: U, ...args: Parameters<L[U]>): boolean {
        if(!this.#listeners[event]) this.#listeners[event] = [];
        for (const listener of this.#listeners[event]) {
            listener(...args);
        }
        return true;
    };
}