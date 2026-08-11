import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  categoryName: { type: String, required: true },
  priceEUR: { type: Number, required: true },
  originalPriceEUR: { type: Number },
  badge: { type: String },
  badgeClass: { type: String },
  primaryImage: { type: String, required: true },
  secondaryImage: { type: String, required: true },
  description: { type: String, required: true },
  sizes: [{ type: String }],
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
