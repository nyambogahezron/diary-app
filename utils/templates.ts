import { database } from '../services';
import type { Template } from '../types';

export const defaultTemplates: Omit<Template, 'id' | 'createdAt'>[] = [
  {
    name: 'Daily Reflection',
    description: 'Reflect on your day',
    content: `# Daily Reflection

## What went well today?
- 

## What could have been better?
- 

## What did I learn?
- 

## Tomorrow I will focus on:
- `,
    category: 'daily',
  },
  {
    name: 'Gratitude Journal',
    description: 'Write about what you are grateful for',
    content: `# Gratitude Journal

## Today I am grateful for:

1. 
2. 
3. 

## Why am I grateful?
- 

## How can I show my gratitude?
- `,
    category: 'gratitude',
  },
  {
    name: 'Dream Journal',
    description: 'Record your dreams',
    content: `# Dream Journal

## Dream Date
Date: 

## Dream Description
- 

## Emotions Felt
- 

## Symbols & Meanings
- 

## Interpretation
- `,
    category: 'dream',
  },
  {
    name: 'Bullet Journal',
    description: 'Quick bullet-style entry',
    content: `# Bullet Journal

## Tasks
- [ ] 
- [ ] 
- [ ] 

## Notes
- 
- 

## Events
- 
- `,
    category: 'bullet',
  },
];

export async function initializeTemplates() {
  try {
    const existingTemplates = await database.getAllTemplates();
    if (existingTemplates.length === 0) {
      for (const template of defaultTemplates) {
        await database.createTemplate({
          ...template,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error('Error initializing templates:', error);
  }
}

