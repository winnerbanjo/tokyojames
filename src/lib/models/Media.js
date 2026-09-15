import mongoose from 'mongoose';
const schema = new mongoose.Schema({ _id: String, data: Buffer, contentType: String });
export default mongoose.models.Media || mongoose.model('Media', schema);
