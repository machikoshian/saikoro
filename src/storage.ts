export class KeyValue {
    constructor(
        public key: string = "",
        public value: any = null) {}
}

export abstract class Storage {
    abstract get(key: string, callback: (err: any, value: any) => void): void;
    abstract set(key: string, value: any, callback: (err: any) => void, expire: number): void;
    abstract delete(key: string): void;
    abstract getWithPromise(key: string): Promise<KeyValue>;
    abstract setWithPromise(key: string, value: any): Promise<KeyValue>;
    abstract deleteWithPromise(key: string): Promise<KeyValue>;

    public getKeysForDebug(): string[] {
        return [];
    }
}

export class LocalStorage extends Storage {
    public storage: { [key: string]: any; } = {};

    private parseKey(key_string: string): string[] {
        let keys: string[] = [];
        for (let key of key_string.split("/")) {
            if (key !== "") {
                keys.push(key);
            }
        }
        return keys;
    }

    private getValue(key: string): any {
        let keys: string[] = this.parseKey(key);
        let storage: any = this.storage;
        for (let i: number = 0; i < keys.length; ++i) {
            storage = storage[keys[i]];
            if (storage == undefined) {
                return undefined;
            }
        }
        return storage;
    }

    private setValue(key: string, value: any): void {
        let keys: string[] = this.parseKey(key);
        if (keys.length === 0) {
            this.storage = value;  // Replace all.
            return;
        }

        let storage: any = this.storage;
        for (let i: number = 0; i < keys.length - 1; ++i) {
            let child = storage[keys[i]];
            if (child == undefined) {
                storage[keys[i]] = {};
                storage = storage[keys[i]];
            }
            else {
                storage = child;
            }
        }
        storage[keys[keys.length - 1]] = value;
    }

    private deleteValue(key: string): void {
        let keys: string[] = this.parseKey(key);
        if (keys.length === 0) {
            this.storage = {};  // Delete all.
            return;
        }

        let storage: any = this.storage;
        for (let i: number = 0; i < keys.length - 1; ++i) {
            storage = storage[keys[i]];
            if (storage == undefined) {
                return;  // Already deleted.
            }
        }
        delete storage[keys[keys.length - 1]];
        // TODO: delete parent nodes.
    }

    public get(key: string, callback: (err: any, value: any) => void): void {
        let value = this.getValue(key);
        if (value != undefined) {
            callback(null, this.storage[key]);
        }

    }

    public getWithPromise(key: string): Promise<KeyValue> {
        return new Promise<KeyValue>((resolve, reject) => {
            let data: KeyValue = new KeyValue(key, this.getValue(key));
            resolve(data);
        });
    }

    public delete(key: string): void {
        this.deleteValue(key);
    }

    public deleteWithPromise(key: string): Promise<KeyValue> {
        this.deleteValue(key);
        return new Promise<KeyValue>((resolve, reject) => {
            let data: KeyValue = new KeyValue(key, null);
            resolve(data);
        });
    }

    public getKeys(): string[] {
        return Object.keys(this.storage);
    }

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        this.setValue(key, value);
        callback(null);
    }

    public setWithPromise(key: string, value: any): Promise<KeyValue> {
        this.setValue(key, value);
        return new Promise<KeyValue>((resolve, reject) => {
            let data: KeyValue = new KeyValue(key, value);
            resolve(data);
        });
    }

    public getKeysForDebug(): string[] {
        return Object.keys(this.storage);
    }
}
