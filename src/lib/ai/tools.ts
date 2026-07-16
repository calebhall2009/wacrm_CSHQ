export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, any>
      required?: string[]
    }
  }
}

export const AI_TOOLS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'check_availability',
      description: 'Check the calendar for available time slots or conflicting appointments before booking.',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'The date to check in YYYY-MM-DD format (e.g. "2026-07-20").'
          }
        },
        required: ['date']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'book_appointment',
      description: 'Book an appointment or schedule a meeting for a customer in the calendar.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title or subject of the appointment (e.g. "Consultation", "Meeting with John").'
          },
          start_time: {
            type: 'string',
            description: 'The start time of the appointment in ISO 8601 format (e.g. "2026-07-20T10:00:00Z").'
          },
          end_time: {
            type: 'string',
            description: 'The end time of the appointment in ISO 8601 format (e.g. "2026-07-20T11:00:00Z").'
          },
          notes: {
            type: 'string',
            description: 'Any additional notes or details for the appointment.'
          }
        },
        required: ['title', 'start_time', 'end_time']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'update_deal_stage',
      description: 'Move a customer to a new stage in the sales pipeline (e.g., when they agree to buy).',
      parameters: {
        type: 'object',
        properties: {
          stage_name: {
            type: 'string',
            description: 'The exact name of the pipeline stage to move the customer to. Usually "Won", "Lost", "Qualified", "Proposal".'
          },
          deal_value: {
            type: 'number',
            description: 'Optional estimated value of the deal in numbers (e.g., 500).'
          },
          notes: {
            type: 'string',
            description: 'Optional context about why the deal was updated.'
          }
        },
        required: ['stage_name']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'update_contact',
      description: 'Update the contact profile information (name, email, company).',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The updated full name of the customer.'
          },
          email: {
            type: 'string',
            description: 'The updated email address of the customer.'
          },
          company: {
            type: 'string',
            description: 'The updated company name of the customer.'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'add_tag',
      description: 'Add a tag or label to the contact profile based on the conversation (e.g. VIP, Interested).',
      parameters: {
        type: 'object',
        properties: {
          tag: {
            type: 'string',
            description: 'The name of the tag to add.'
          }
        },
        required: ['tag']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'add_internal_note',
      description: 'Add an internal note to the contact profile for human agents to read later.',
      parameters: {
        type: 'object',
        properties: {
          note: {
            type: 'string',
            description: 'The text content of the internal note.'
          }
        },
        required: ['note']
      }
    }
  }
]
