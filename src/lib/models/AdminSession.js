import mongoose from 'mongoose';
const schema = new mongoose.Schema({ _id: String, expiresAt: { type: Date, expires: 0 } });
export default mongoose.models.AdminSession || mongoose.model('AdminSession', schema);
