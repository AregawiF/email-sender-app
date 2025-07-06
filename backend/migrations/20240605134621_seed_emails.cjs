/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('emails').insert([
    {
      to: 'me@example.com',
      cc: 'team@example.com',
      bcc: '',
      subject: 'Project Update - Q1 Results',
      body: 'Hi team, I wanted to share the Q1 results with everyone. We exceeded our targets by 15% and are on track for a successful year. Please review the attached report and let me know if you have any questions.',
      created_at: new Date('2024-01-15T10:30:00Z'),
      updated_at: new Date('2024-01-15T10:30:00Z')
    },
    {
      to: 'me@example.com',
      cc: '',
      bcc: '',
      subject: 'Meeting Tomorrow at 2 PM',
      body: 'Hi, just a reminder about our meeting tomorrow at 2 PM. Please prepare the quarterly report and bring any questions you might have. We\'ll be discussing the upcoming project timeline.',
      created_at: new Date('2024-01-14T16:45:00Z'),
      updated_at: new Date('2024-01-14T16:45:00Z')
    },
    {
      to: 'me@example.com',
      cc: 'hr@example.com',
      bcc: '',
      subject: 'New Employee Onboarding',
      body: 'We have a new team member joining next week. Please review the onboarding schedule and make sure your departments are prepared. The new employee will be shadowing different teams for the first week.',
      created_at: new Date('2024-01-13T09:15:00Z'),
      updated_at: new Date('2024-01-13T09:15:00Z')
    },
    {
      to: 'me@example.com',
      cc: 'marketing@example.com',
      bcc: 'legal@example.com',
      subject: 'Marketing Campaign Approval',
      body: 'The new marketing campaign has been reviewed and is ready for approval. Please review the materials and let us know if any changes are needed before we proceed with the launch.',
      created_at: new Date('2024-01-12T14:20:00Z'),
      updated_at: new Date('2024-01-12T14:20:00Z')
    },
    {
      to: 'me@example.com',
      cc: '',
      bcc: '',
      subject: 'System Maintenance Notice',
      body: 'Scheduled system maintenance will occur this weekend from 2 AM to 6 AM. During this time, the email system may experience brief interruptions. We apologize for any inconvenience.',
      created_at: new Date('2024-01-11T11:00:00Z'),
      updated_at: new Date('2024-01-11T11:00:00Z')
    }
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('emails').del();
}; 