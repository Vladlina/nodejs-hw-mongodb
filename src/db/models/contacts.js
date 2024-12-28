import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: {
      type: String,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      trim: true,
      lowercase: true,
    },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    photo: { type: String },
  },

  { timestamps: true, versionKey: false },
);

export const ContactsCollection = model('contacts', contactSchema);
