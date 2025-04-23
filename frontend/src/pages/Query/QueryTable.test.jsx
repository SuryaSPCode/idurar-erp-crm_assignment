import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QueryTable from './QueryTable';

jest.mock('@/locale/useLanguage', () => () => (key) => key); // Mock translation

const mockData = [
  {
    _id: '1',
    customerName: 'John Doe',
    description: 'Issue with login',
    createdAt: '2024-04-20T12:00:00Z',
    status: 'open',
    resolution: 'Pending',
  },
];

const mockHandlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onViewNotes: jest.fn(),
};

describe('QueryTable', () => {
  it('renders table with data', () => {
    render(
      <QueryTable
        data={mockData}
        loading={false}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onViewNotes={mockHandlers.onViewNotes}
        pagination={false}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Issue with login')).toBeInTheDocument();
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('edit')).toBeInTheDocument();
    expect(screen.getByText('notes')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
  });

  it('calls edit handler', () => {
    render(
      <QueryTable
        data={mockData}
        loading={false}
        {...mockHandlers}
        pagination={false}
        onChange={() => {}}
      />
    );

    fireEvent.click(screen.getByText('edit'));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it('calls notes handler', () => {
    render(
      <QueryTable
        data={mockData}
        loading={false}
        {...mockHandlers}
        pagination={false}
        onChange={() => {}}
      />
    );

    fireEvent.click(screen.getByText('notes'));
    expect(mockHandlers.onViewNotes).toHaveBeenCalledWith(mockData[0]);
  });

  it('shows delete popconfirm and confirms deletion', () => {
    render(
      <QueryTable
        data={mockData}
        loading={false}
        {...mockHandlers}
        pagination={false}
        onChange={() => {}}
      />
    );

    fireEvent.click(screen.getByText('delete'));
    const popConfirmYes = screen.getByText('yes');
    fireEvent.click(popConfirmYes);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });
});
