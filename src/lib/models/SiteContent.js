import mongoose from 'mongoose';
const schema = new mongoose.Schema({ _id: String, data: mongoose.Schema.Types.Mixed }, { timestamps: true });
export default mongoose.models.SiteContent || mongoose.model('SiteContent', schema);
