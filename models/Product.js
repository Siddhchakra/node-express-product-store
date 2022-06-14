const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty'],
    trim: true,
    maxlength: [20, 'Name cannot exceed 20 characters.']
  },
  price: {
    type: Number,
    required: [true, 'Price cannot be empty']
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  company: {
    type: String,
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      message: '{VALUE} is not supported' //This is validator to show when company apart from the above list is passed
    }
  }
});

//This creates createdAt and updatedAt keys.
ProductSchema.set('timestamps', true);

module.exports = mongoose.model('Product', ProductSchema);
