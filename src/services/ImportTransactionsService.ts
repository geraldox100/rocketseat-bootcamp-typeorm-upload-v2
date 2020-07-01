import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import * as path from 'path';
import parse from 'csv-parse/lib/sync'
import uploadConfig from '../config/upload.config';

class ImportTransactionsService {
  async execute(expressFile:Express.Multer.File): Promise<Transaction[]> {
    const transactions:Transaction[] = [];
    
    const createTransactionService = new CreateTransactionService();

    const fs = require('fs');
    const file = fs.readFileSync(path.resolve(uploadConfig.directory, expressFile.filename), 'utf8');
    

    const records = parse(file,{
      columns: true,
      skip_empty_lines: true,
      trim:true,
      on_record: (record, {lines}) => {
        record.value = parseFloat(record.value);
        return record;
      }
    });

    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const transaction:Transaction = await createTransactionService.execute(record);
      transactions.push(transaction);
    }
           
    return transactions;
  }
}

export default ImportTransactionsService;
