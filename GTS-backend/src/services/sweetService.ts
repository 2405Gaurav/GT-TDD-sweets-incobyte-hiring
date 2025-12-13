import { Sweet, ISweet } from '../models/Sweets';
import mongoose from 'mongoose';

export interface CreateSweetPayload {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface UpdateSweetPayload {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
}

export const createSweet = async (payload: CreateSweetPayload): Promise<ISweet> => {
  // Add statusCode to errors for proper HTTP responses
  if (payload.price < 0) {
    const error = new Error('Price cannot be negative');
    (error as any).statusCode = 400;
    throw error;
  }
  if (payload.quantity < 0) {
    const error = new Error('Quantity cannot be negative');
    (error as any).statusCode = 400;
    throw error;
  }

  const sweet = new Sweet(payload);
  return sweet.save();
};

// Return array directly for simple GET all - tests expect array
export const getAllSweets = async (): Promise<ISweet[]> => {
  const sweets = await Sweet.find().sort({ createdAt: -1 });
  return sweets;
};

// Paginated version (optional - use when you need pagination)
export const getSweetsPaginated = async (
  page: number = 1,
  limit: number = 10
): Promise<{ sweets: ISweet[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const sweets = await Sweet.find().skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Sweet.countDocuments();
  const pages = Math.ceil(total / limit);

  return { sweets, total, pages };
};

export const searchSweets = async (
  query: string,
  priceMin?: number,
  priceMax?: number
): Promise<ISweet[]> => {
  const filter: Record<string, unknown> = {};

  if (query) {
    filter.$text = { $search: query };
  }

  if (priceMin !== undefined || priceMax !== undefined) {
    filter.price = {};
    if (priceMin !== undefined) (filter.price as Record<string, number>).$gte = priceMin;
    if (priceMax !== undefined) (filter.price as Record<string, number>).$lte = priceMax;
  }

  return Sweet.find(filter);
};

export const getSweetById = async (id: string): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid sweet ID');
    (error as any).statusCode = 400;
    throw error;
  }
  
  const sweet = await Sweet.findById(id);
  
  if (!sweet) {
    const error = new Error('Sweet not found');
    (error as any).statusCode = 404;
    throw error;
  }
  
  return sweet;
};

export const updateSweet = async (id: string, payload: UpdateSweetPayload): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid sweet ID');
    (error as any).statusCode = 400;
    throw error;
  }

  if (payload.price !== undefined && payload.price < 0) {
    const error = new Error('Price cannot be negative');
    (error as any).statusCode = 400;
    throw error;
  }
  if (payload.quantity !== undefined && payload.quantity < 0) {
    const error = new Error('Quantity cannot be negative');
    (error as any).statusCode = 400;
    throw error;
  }

  const sweet = await Sweet.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  
  if (!sweet) {
    const error = new Error('Sweet not found');
    (error as any).statusCode = 404;
    throw error;
  }
  
  return sweet;
};

export const deleteSweet = async (id: string): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid sweet ID');
    (error as any).statusCode = 400;
    throw error;
  }
  
  const sweet = await Sweet.findByIdAndDelete(id);
  
  if (!sweet) {
    const error = new Error('Sweet not found');
    (error as any).statusCode = 404;
    throw error;
  }
  
  return sweet;
};

export const purchaseSweet = async (id: string, quantity: number): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid sweet ID');
    (error as any).statusCode = 400;
    throw error;
  }

  if (quantity <= 0) {
    const error = new Error('Quantity must be greater than 0');
    (error as any).statusCode = 400;
    throw error;
  }

  const sweet = await Sweet.findById(id);
  if (!sweet) {
    const error = new Error('Sweet not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (sweet.quantity < quantity) {
    const error = new Error('Insufficient quantity available');
    (error as any).statusCode = 400;
    throw error;
  }

  sweet.quantity -= quantity;
  return sweet.save();
};

export const restockSweet = async (id: string, quantity: number): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid sweet ID');
    (error as any).statusCode = 400;
    throw error;
  }

  if (quantity <= 0) {
    const error = new Error('Restock quantity must be greater than 0');
    (error as any).statusCode = 400;
    throw error;
  }

  const sweet = await Sweet.findById(id);
  if (!sweet) {
    const error = new Error('Sweet not found');
    (error as any).statusCode = 404;
    throw error;
  }

  sweet.quantity += quantity;
  return sweet.save();
};