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
    console.log(criteria);
    return Promise.all([
        Artist.find({
            name: {
                $regex: criteria.name,
                $options: 'i'
            },
            age: {
                $gte: criteria.age ? criteria.age.min : 0,
                $lte: criteria.age ? criteria.age.max : 100
            },
            yearsActive: {
                $gte: criteria.yearsActive ? criteria.yearsActive.min : 0,
                $lte: criteria.yearsActive ? criteria.yearsActive.max : 100
            }
        }).sort({ [sortProperty]: 1 }).skip(offset).limit(limit),
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
