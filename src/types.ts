export type Entity = {
    "name": string;
    "props": EntityProp[];
};

export type EntityProp = {
    "name": string;
    "required"?: boolean;
    "searchEnabler"?: boolean;
    "type": string;
};