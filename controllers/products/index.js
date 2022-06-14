const asyncWrapper = require('../../middlewares/asyncWrapper');
const Product = require('../../models/Product');
const { createCustomError } = require('../../utils/customError');
const {
  convertUserFilterToMongoQueryOperator
} = require('../../utils/mongoDBUtil');

const getProducts = asyncWrapper(async (req, res) => {
  const {
    searchBy,
    filterBy,
    sortBy, // e.g. name,-price
    currentPage, //current page
    perPage //Product per page
  } = req.query;

  //Creates Search Object
  const searchObject = {
    ...(searchBy
      ? {
          $or: [
            { name: { $regex: searchBy, $options: 'i' } },
            { company: { $regex: searchBy, $options: 'i' } }
          ]
        }
      : {})
  };

  //Creates Filter or Range Object
  const filterObject = convertUserFilterToMongoQueryOperator(filterBy, [
    'featured',
    'price',
    'rating'
  ]);

  //Creates the initial number of records that should be skipped
  const paginationOptions = {
    skip: (currentPage - 1) * perPage,
    limit: perPage
  };

  /* #1 Approach */
  //Execute find query using pagination options
  const products = await Product.find(
    {
      ...searchObject,
      ...filterObject
    },
    null,
    {
      ...paginationOptions,
      sort: sortBy ? sortBy.replace(/,/g, ' ') : 'createdAt'
    } //This option is added to make pagination
  );
  /* #1 Approach END */

  /* #2 Approach */
  // let result = Product.find(
  //   {
  //     ...searchObject,
  //     ...filterObject
  //   },
  //   null,
  //   {
  //     ...paginationOptions,
  //     sort: sortBy ? sortBy.replace(/,/g, ' ') : 'createdAt'
  //   } //This option is added to make pagination
  // )
  //   .skip((currentPage - 1) * perPage)
  //   .limit(perPage);

  // if (sortBy) {
  //   result = result.sort(sortBy.replace(/,/g, ' '));
  // } else {
  //   result = result.sort('createdAt');
  // }

  //By adding await here the Promise gets resolved post 'find()' and 'sort()'.
  //If the 'await' is added at the line of 'find' or 'sort' then chaining will fail with resolved state.
  // const products = await result;
  /* #2 Approach END */

  res.json({ success: true, total: products.length, products });
});

const createProduct = asyncWrapper(async (req, res) => {
  const { name } = req.body;

  //Mongoose ignores/omit the keys which are not mentioned in the schema
  //E.g. apart from 'name' if 'random' key is passed while creating the document
  //     then 'random' key is ignored and the record with 'name' and' will be created.
  const product = await Product.create({ name });

  res.json({ success: true, product });
});

const getProductDetails = asyncWrapper(async (req, res, next) => {
  const { id: paramId } = req.params;

  const product = await Product.findOne({ _id: paramId });

  if (!product) {
    return next(createCustomError('Product not found!', 404));
  }

  res.json({ success: true, product });
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const { id: paramId } = req.params;
  const { name: paramTitle } = req.body;

  const product = await Product.findOneAndUpdate(
    {
      _id: paramId
    },
    { name: paramTitle },
    {
      new: true, //This will return the updated record on successful update
      runValidators: true //This will run the validator while update that are set in schema
    }
  );

  if (!product) {
    return next(createCustomError('Product not found!', 404));
  }

  res.json({ success: true, product });
});

const deleteProduct = asyncWrapper(async (req, res, next) => {
  const { id: paramId } = req.params;

  const product = await Product.findOneAndDelete({ _id: paramId });

  if (!product) {
    return next(createCustomError('Product not found!', 404));
  }

  res.json({ success: true, product });
});

module.exports = {
  getProducts,
  createProduct,
  getProductDetails,
  updateProduct,
  deleteProduct
};
