import { capitalize } from 'lodash';
import handlebars from './handlebars';
import { Entity } from "./types";

type SearchEnabler = {
    name: string;
    "type": string;
};

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
    context?: IDataContext;
};

export type CreateOpts = MaybeWithContext & {
    {{#each props}}
    {{this.name}}: {{this.type}};
    {{/each}}
};

{{#each searchEnablers}}
export type FindBy{{capitalize this.name}}Opts = {
    {{this.name}}: {{this.type}};
};
{{/each}}

export interface I{{capitalize entityName}}Repository {
    create(opts: CreateOpts): Promise<${capitalizedEntityName} | undefined>;
    {{#each searchEnablers}}
    findBy{{capitalize this.name}}(opts: FindBy{{capitalize this.name}}Opts): Promise<${capitalizedEntityName} | undefined>;
    {{/each}}
    list(opts: ListOpts): Promise<${capitalizedEntityName}[]>;
    toView(opts: ToViewOpts): Promise<${capitalizedEntityName}View>;
    update(opts: UpdateOpts): Promise<${capitalizedEntityName} | undefined>;
};
`;

    const searchEnablers: SearchEnabler[] = [];
    for (const prop of props) {
        if (prop.searchEnabler) {
            const se: SearchEnabler = {
                "name": prop.name,
                "type": prop.type
            };

            searchEnablers.push(se);
        }
    }

    const template = handlebars.compile(codeTemplate);

    const templateData = {
        "entityName": name,
        "props": props,
        "searchEnablers": searchEnablers,
    };

    const generatedContent = template(templateData);

    return generatedContent;
};
