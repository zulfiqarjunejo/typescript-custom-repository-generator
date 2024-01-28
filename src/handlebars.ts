import handlebars from "handlebars";

handlebars.registerHelper('capitalize', function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
});

export default handlebars;