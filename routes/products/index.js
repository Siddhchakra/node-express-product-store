const {
  getProducts,
  createProduct,
  getProductDetails,
  updateProduct,
  deleteProduct
} = require('../../controllers/products');

const router = require('express').Router();

//Another way to create routes for EXPRESS
router.route('/').get(getProducts).post(createProduct);

router
  .route('/:id')
  .get(getProductDetails)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
