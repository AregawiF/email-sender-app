import DB from '../db/index.js';

export default async function emailRoutes(fastify, options) {
  // Get all emails
  fastify.get('/emails', async (request, reply) => {
    try {
      const emails = await DB.getAllEmails();
      return { success: true, data: emails };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Failed to fetch emails' 
      });
    }
  });

  // Search emails
  fastify.get('/emails/search', async (request, reply) => {
    try {
      const { q: searchTerm } = request.query;
      
      if (!searchTerm || searchTerm.trim() === '') {
        const emails = await DB.getAllEmails();
        return { success: true, data: emails };
      }

      const emails = await DB.searchEmails(searchTerm.trim());
      return { success: true, data: emails };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Failed to search emails' 
      });
    }
  });

  // Get email by ID
  fastify.get('/emails/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const email = await DB.getEmailById(id);
      
      if (!email) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Email not found' 
        });
      }

      return { success: true, data: email };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Failed to fetch email' 
      });
    }
  });

  // Create new email
  fastify.post('/emails', async (request, reply) => {
    try {
      const { to, cc, bcc, subject, body } = request.body;

      // Validation
      if (!to || !subject) {
        return reply.status(400).send({
          success: false,
          error: 'To and subject are required'
        });
      }

      const emailData = {
        to,
        cc: cc || '',
        bcc: bcc || '',
        subject,
        body: body || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const [newEmail] = await DB.createEmail(emailData);
      
      return reply.status(201).send({
        success: true,
        data: newEmail
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ 
        success: false, 
        error: 'Failed to create email' 
      });
    }
  });
} 