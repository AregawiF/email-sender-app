import knex from 'knex';
import knexfile from '../../knexfile.js';

const db = knex(knexfile.development);

class DB {
  static async getAllEmails() {
    return db('emails').select('*').orderBy('created_at', 'desc');
  }

  static async searchEmails(searchTerm) {
    return db('emails')
      .where('to', 'like', `%${searchTerm}%`)
      .orWhere('cc', 'like', `%${searchTerm}%`)
      .orWhere('bcc', 'like', `%${searchTerm}%`)
      .orWhere('subject', 'like', `%${searchTerm}%`)
      .orWhere('body', 'like', `%${searchTerm}%`)
      .orderBy('created_at', 'desc');
  }

  static async createEmail(emailData) {
    return db('emails').insert(emailData).returning('*');
  }

  static async getEmailById(id) {
    return db('emails').where('id', id).first();
  }
}

export default DB;
