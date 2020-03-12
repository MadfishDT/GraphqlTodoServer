export class ModelValidator {
    constructor() {

    }
    public static emailValidate(email: string): boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    public static contentsValidator = (v) => v.length > 0;
    public static colorValidator = (v) => (/^#([0-9a-f]{3}){1,2}$/i).test(v);
};
