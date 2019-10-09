/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

const validateObjectId = id =>
  ObjectId.isValid(id) && new ObjectId(id).toString() === id;

class APIFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.query = {};
    this.queryString = queryString;
    this.sort = '-publishedAt';
    this.select = '-__v';
  }

  filter(filter) {
    const queryObj = { ...filter, ...this.queryString };

    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'query',
      'filter'
    ];
    excludedFields.forEach(el => delete queryObj[el]);

    if (!validateObjectId(queryObj.category)) {
      delete queryObj.category;
    }

    if (typeof queryObj.type === 'string') {
      queryObj.type = {
        in: queryObj.type.split(',')
      };
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      match => `$${match}`
    );

    this.query = JSON.parse(queryStr);

    return this;
  }

  sortBy() {
    if (this.queryString.sort) {
      if (this.queryString.sort === 'score') {
        this.sort = { score: { $meta: 'textScore' } };
        this.projection = { score: { $meta: 'textScore' } };
      } else {
        this.sort = this.queryString.sort.split(',').join(' ');
      }
    }

    return this;
  }

  fields() {
    if (this.queryString.fields) {
      this.select = this.queryString.fields.split(',').join(' ');
    }

    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 15;
    const skip = (page - 1) * limit;

    let countPromise = [];
    let contentPromise = [];

    if (this.projection !== undefined) {
      countPromise = this.model.find(this.query, {
        ...this.projection,
        ...this.sort
      });
      contentPromise = this.model.find(this.query, {
        ...this.projection,
        ...this.sort
      });
    } else {
      countPromise = this.model.find(this.query);
      contentPromise = this.model.find(this.query).sort(this.sort);
    }

    if (this.queryString.query !== undefined) {
      const searchValue =
        this.queryString.query.indexOf(' ') === -1
          ? `${this.queryString.query}`
          : `"\""${this.queryString.query}"\""`;

      countPromise.where(
        { $text: { $search: searchValue } },
        { score: { $meta: 'textScore' } }
      );

      contentPromise.where(
        { $text: { $search: searchValue } },
        { score: { $meta: 'textScore' } }
      );
    }

    countPromise.countDocuments().exec();

    contentPromise
      .select(this.select)
      .skip(skip)
      .limit(limit)
      .exec();

    return Promise.all([countPromise, contentPromise])
      .then(data => {
        const [count, content] = data;
        const pagination = {
          itemCount: count
        };

        const query = { ...this.queryString };
        const excludedFields = ['page', 'fields'];
        excludedFields.forEach(el => delete query[el]);

        const params = Object.keys(query);
        pagination.link = '?';
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < params.length; i++) {
          const param = params[i];
          pagination.link += `${param}=${query[param]}`;
          if (i + 1 < params.length) {
            pagination.link += '&';
          }
        }

        let result = {};

        if (typeof page !== 'undefined') {
          const pages = limit > 0 ? Math.ceil(count / limit) || 1 : null;
          pagination.hasPrev = false;
          pagination.hasNext = false;
          pagination.page = page;
          pagination.last = pages;

          // Set prev page
          if (page > 1) {
            pagination.hasPrev = true;
            pagination.prev = page - 1;
          }

          // Set next page
          if (page < pages) {
            pagination.hasNext = true;
            pagination.next = page + 1;
          }
        }

        result = { content, pagination };

        return Promise.resolve(result);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}

module.exports = APIFeatures;
