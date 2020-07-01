import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import {getCustomRepository,getRepository, Repository, getConnection} from 'typeorm'
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request{
  title: string; 
  value: number; 
  type: 'income' | 'outcome';
  category: string;  
}

class CreateTransactionService {
  public async execute({title, value, type,category}:Request): Promise<Transaction> {

    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    
    //========ensureBalance===============
    const balance = await transactionRepository.getBalance();

    if(type==="outcome" && balance.total < value){
      throw new AppError('no balance available',400);
    }
    //====================================
    //=========saveCategory===============
    let savedCategory = await categoryRepository.findOne({
      where:{ title: category }
    });

    if(!savedCategory){
      const newCategory = categoryRepository.create({title:category})
      savedCategory = await categoryRepository.save(newCategory);
    }
    //====================================
    
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id:savedCategory.id
    });
    
    await transactionRepository.save(transaction);
    
    return transaction;

  }
}

export default CreateTransactionService;
