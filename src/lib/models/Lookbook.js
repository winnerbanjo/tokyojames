import mongoose from 'mongoose';

const LookbookSchema = new mongoose.Schema({
  season: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  videoUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Lookbook || mongoose.model('Lookbook', LookbookSchema);
