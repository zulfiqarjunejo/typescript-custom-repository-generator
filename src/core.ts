import handlebars from './handlebars';
import { Entity } from "./types";

const codeTemplate = `
{{#each searchEnablers}}
export type FindBy{{capitalize this.name}}Opts = {
    {{this.name}}: {{this.type}};
};
{{/each}}

export interface I{{capitalize entityName}}Repository {
    {{#each searchEnablers}}
    findBy{{capitalize this.name}}(opts: FindBy{{capitalize this.name}}Opts): Promise<{{capitalize this.name}} | undefined>;
    {{/each}}
};
`;

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
        "searchEnablers": searchEnablers
    };

    const generatedContent = template(templateData);

    return generatedContent;
};
