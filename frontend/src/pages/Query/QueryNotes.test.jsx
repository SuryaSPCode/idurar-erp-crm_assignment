import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QueryNotes from './QueryNotes';

jest.mock('@/locale/useLanguage', () => () => (key) => key);

const mockQuery = {
  _id: '1',
  customerName: 'Acme Corp',
  notes: [
    { _id: 'n1', content: 'Test note', createdAt: new Date().toISOString() },
  ],
};

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  onAddNote: jest.fn().mockResolvedValue(),
  onDeleteNote: jest.fn(),
  query: mockQuery,
};

describe('QueryNotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders notes list and input', () => {
    render(<QueryNotes {...defaultProps} />);
    expect(screen.getByText('notes_for Acme Corp')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter_note')).toBeInTheDocument();
    expect(screen.getByText('Test note')).toBeInTheDocument();
  });

  it('shows error when adding empty note', () => {
    render(<QueryNotes {...defaultProps} />);
    fireEvent.click(screen.getByText('add_note'));
    expect(screen.getByText('please_enter_note')).toBeInTheDocument();
  });

  it('calls onAddNote when valid note is submitted', async () => {
    render(<QueryNotes {...defaultProps} />);
    const textarea = screen.getByPlaceholderText('enter_note');
    fireEvent.change(textarea, { target: { value: 'New note' } });
    fireEvent.click(screen.getByText('add_note'));

    await waitFor(() => {
      expect(defaultProps.onAddNote).toHaveBeenCalledWith('1', 'New note');
    });
  });

  it('calls onDeleteNote when delete is clicked', () => {
    render(<QueryNotes {...defaultProps} />);
    fireEvent.click(screen.getByText('delete'));
    expect(defaultProps.onDeleteNote).toHaveBeenCalledWith('1', 'n1');
  });
});
