import { capitalize } from 'lodash';
import handlebars from './handlebars';
import { Entity, EntityProp } from "./types";

type GenerateRepositoryOpts = {
    entity: Entity;
};
export const generateRepository = (opts: GenerateRepositoryOpts): any => {
    const name = opts.entity.name.trim();
    const props = opts.entity.props;

    const capitalizedEntityName = capitalize(name);

    const codeTemplate = `

/**
 * \`WithContext\` represents a generic type containing \`context\`. 
 */
export type WithContext = {
    /**
     * context, if available.
     */
    context?: Nilable<IDataContext>;
};

/**
 * Options for \`create\` method.
 */
export type CreateOpts = WithContext & {
    {{#each searchEnablers}}
    /**
     * {{this.comment}}
     */
    {{this.name}}: {{this.type}}
    {{/each}}
    {{#each ordinaryProps}}
    /**
     * {{this.comment}}
     */
    {{this.name}}: {{this.type}};
    {{/each}}
};

{{#each searchEnablers}}
/**
 * Options for \`findBy{{capitalize this.name}}\` method.
 */
export type FindBy{{capitalize this.name}}Opts = WithContext & {
    /**
     * {{this.comment}}
     */
    {{this.name}}: {{this.type}};

    /**
     * Throw error if not found.
     *
     * @default \`false\`
     */
    throwIfNotFound?: Nilable<boolean>;
};
{{/each}}

/**
 * Options for \`list\` method.
 */
export type ListOpts = WithContext & {
};

/**
 * Options for \`toView\` method.
 */
export type ToViewOpts = WithContext & {
    /**
     * The entity.
     */
    {{this.entityName}}: ${capitalizedEntityName};
    /**
     * Language used to return localized resource.
     */
    lang: string;
};

/**
 * Options for \`update\` method.
 */
export type UpdateOpts = WithContext & {
    {{#each searchEnablers}}
    /**
     * {{this.comment}}
     */
    {{this.name}}: {{this.type}}
    {{/each}}
    {{#each ordinaryProps}}
    /**
     * (Optional) {{this.comment}}
     */
    {{this.name}}?: {{this.type}};
    {{/each}}
};

/**
 * I${capitalizedEntityName}Repository represents blueprint for {{this.entityName}} repository.
 */
export interface I{{capitalize entityName}}Repository {
    /**
     * Creates a new entry of {{this.entityName}}.
     * 
     * @param opts - The options.
     * @returns A promise that resolves to the new entry.
     */
    create(opts: CreateOpts): Promise<${capitalizedEntityName}>;
    {{#each searchEnablers}}
    /**
     * Find an entry specified by {{this.name}}.
     * 
     * @param opts - The options.
     * @returns A promise that resolves to the entry.
     */
    findBy{{capitalize this.name}}(opts: FindBy{{capitalize this.name}}Opts): Promise<Nullable<${capitalizedEntityName}>>; 
    {{/each}}
    /**
     * Lists all entries of {{this.entityName}}.
     * 
     * @param opts - The options.
     * @returns A promise that resolves to list of entries.
     */
    list(opts: ListOpts): Promise<${capitalizedEntityName}[]>;
    /**
     * Converts an entry of {{this.entityName}} to its view.
     * 
     * @param opts - The options.
     * @returns A promise that resolves to the view.
     */
    toView(opts: ToViewOpts): Promise<I${capitalizedEntityName}View>;
    /**
     * Updates an existing entry of {{this.entityName}}.
     * 
     * @param opts - The options.
     * @returns A promise that resolves to the entry.
     */
    update(opts: UpdateOpts): Promise<Nullable<${capitalizedEntityName}>>;
};
`;

    const ordinaryProps: EntityProp[] = [];
    const searchEnablers: EntityProp[] = [];

    for (const prop of props) {
        if (prop.searchEnabler) {
            searchEnablers.push(prop);
        } else {
            ordinaryProps.push(prop);
        }
    }

    const template = handlebars.compile(codeTemplate);

    const templateData = {
        "entityName": name,
        "ordinaryProps": ordinaryProps,
        "searchEnablers": searchEnablers,
    };

    const generatedContent = template(templateData);

    return generatedContent;
};
