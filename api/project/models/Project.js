'use strict';

const { cache, createSlug, markdownToHtml } = require('../../../utility');

/**
 * Lifecycle callbacks for the `Project` model.
 */

module.exports = {
    // Before saving a value.
    // Fired before an `insert` or `update` query.
    // beforeSave: async (model, attributes, options) => {},

    // After saving a value.
    // Fired after an `insert` or `update` query.
    // afterSave: async (model, response, options) => {},

    // Before fetching a value.
    // Fired before a `fetch` operation.
    // beforeFetch: async (model, columns, options) => {},

    // After fetching a value.
    // Fired after a `fetch` operation.
    // afterFetch: async (model, response, options) => {},

    // Before fetching all values.
    // Fired before a `fetchAll` operation.
    // beforeFetchAll: async (model, columns, options) => {},

    // After fetching all values.
    // Fired after a `fetchAll` operation.
    // afterFetchAll: async (model, response, options) => {},

    // Before creating a value.
    // Fired before an `insert` query.
    beforeCreate: async function(model, attributes) {
        // Name is required, so it will always be there on insert
        const options = { slug: createSlug(attributes.name) };

        if (attributes.description) {
            options.description_html = markdownToHtml(attributes.description);
        }

        return model.set(options);
    },

    // After creating a value.
    // Fired after an `insert` query.
    // afterCreate: async (model, attrs, options) => {},

    // Before updating a value.
    // Fired before an `update` query.
    beforeUpdate: async function(model, attributes) {
        if (attributes.name) {
            attributes.slug = createSlug(attributes.name);
        }

        if (attributes.description) {
            attributes.description_html = markdownToHtml(attributes.description);
        }
    },

    // After updating a value.
    // Fired after an `update` query.
    afterUpdate: async function(model, attributes, options) {
        const company = model.related('company');

        await cache.del([
            'projects',
            `projects:${model.get('slug')}`,
            `companies:${company.get('slug')}`
        ]);
    }

    // Before destroying a value.
    // Fired before a `delete` query.
    // beforeDestroy: async (model, attrs, options) => {},

    // After destroying a value.
    // Fired after a `delete` query.
    // afterDestroy: async (model, attrs, options) => {}
};
