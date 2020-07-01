import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload.config';  

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();
  return response.json({transactions,balance});
});

transactionsRouter.post('/', async (request, response) => {
  const {title, value, type, category} = request.body;

  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute({ title, value, type, category })
    
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute(request.params.id);
  return response.status(201).send();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const file = request.file;
  const importTransactionService = new ImportTransactionsService();
  const transactions = await importTransactionService.execute(file);

  return response.json(transactions);  
});

export default transactionsRouter;


