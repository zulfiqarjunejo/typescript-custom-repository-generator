export type Entity = {
    "name": string;
    "props": EntityProp[];
};

export type EntityProp = {
    "comment": string;
    "name": string;
    "required"?: boolean;
    "searchEnabler"?: boolean;
    "type": string;
};