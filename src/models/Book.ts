import mongoose, { Document, Schema } from 'mongoose';
import Author from './Author';

export interface IBook {
  title: string;
  author: string;
}

export interface IBookModel extends IBook, Document {}

const BookSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: Author,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBookModel>('Book', BookSchema);
