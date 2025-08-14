import Product, { ProductDocument } from '../models/Product';

export async function listProducts() {
  return Product.find().sort({ createdAt: -1 });
}

export async function getProductById(id: string) {
  return Product.findById(id);
}

export async function createProduct(data: Partial<ProductDocument>) {
  return Product.create(data);
}

export async function updateProduct(id: string, data: Partial<ProductDocument>) {
  return Product.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteProduct(id: string) {
  await Product.findByIdAndDelete(id);
}

export default { listProducts, getProductById, createProduct, updateProduct, deleteProduct };



