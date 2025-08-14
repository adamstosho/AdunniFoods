import { Request, Response } from 'express';
import * as ProductService from '../services/product.service';

export async function list(req: Request, res: Response) {
  const products = await ProductService.listProducts();
  res.json({ message: 'ok', response: products });
}

export async function getById(req: Request, res: Response) {
  const product = await ProductService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'ok', response: product });
}

export async function create(req: Request, res: Response) {
  const created = await ProductService.createProduct(req.body);
  res.status(201).json({ message: 'created', response: created });
}

export async function update(req: Request, res: Response) {
  const updated = await ProductService.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'updated', response: updated });
}

export async function remove(req: Request, res: Response) {
  await ProductService.deleteProduct(req.params.id);
  res.status(204).send();
}

export default { list, getById, create, update, remove };



