// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionDTO): Promise<Transaction> {
    let categoryId;

    const categoryRepository = getRepository(Category);
    const transactionRepostory = getRepository(Transaction);

    const categoryAlreadyExists = await categoryRepository.find({
      where: { title: category },
    });

    if (!categoryAlreadyExists || categoryAlreadyExists.length === 0) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      const newCategoryData = await categoryRepository.save(newCategory);

      categoryId = newCategoryData.id;
    } else {
      categoryId = categoryAlreadyExists[0].id;
    }

    const newTransaction = transactionRepostory.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    console.log(newTransaction);

    const transaction = await transactionRepostory.save(newTransaction);

    return transaction;
  }
}

export default CreateTransactionService;
