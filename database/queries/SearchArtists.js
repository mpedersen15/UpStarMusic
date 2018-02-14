const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
    return Promise.all([
        Artist
            .find(buildFindObject(criteria))
            .sort({ [sortProperty]: 1 })
            .skip(offset)
            .limit(limit),
        Artist.count()
    ]).then(results => {
        return {
            all: results[0],
            count: results[1],
            offset,
            limit
        };
    });

};

function buildFindObject(criteria) {
    /* const findObject = {
        name: {
            $regex: criteria.name,
            $options: 'i'
        }
    }; */

    const findObject = {}

    if (criteria.name) {
        findObject.$text = {
            $search: criteria.name
        };
    }
        

    if (criteria.age) {
        findObject.age = {
            $gte: criteria.age.min,
            $lte: criteria.age.max
        };
    }

    if (criteria.yearsActive) {
        findObject.yearsActive = {
            $gte: criteria.yearsActive.min,
            $lte: criteria.yearsActive.max
        };
    }

    return findObject;
}
