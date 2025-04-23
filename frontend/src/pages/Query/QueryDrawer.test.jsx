import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QueryDrawer from './QueryDrawer';

jest.mock('@/locale/useLanguage', () => () => (key) => key); // mock translation

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  initialValues: {
    customerName: 'Jane Doe',
    description: 'Something is wrong',
    status: 'open',
    resolution: '',
  },
  mode: 'edit',
};

describe('QueryDrawer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial values', () => {
    render(<QueryDrawer {...defaultProps} />);
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Something is wrong')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<QueryDrawer {...defaultProps} />);
    fireEvent.click(screen.getByText('cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('validates and submits form', async () => {
    render(<QueryDrawer {...defaultProps} />);
    fireEvent.click(screen.getByText('update'));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        customerName: 'Jane Doe',
        description: 'Something is wrong',
        status: 'open',
        resolution: '',
      });
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows validation message when required fields are missing', async () => {
    render(<QueryDrawer {...defaultProps} initialValues={{}} />);
    fireEvent.click(screen.getByText('update'));

    await waitFor(() =>
      expect(screen.getByText('please_enter_customer_name')).toBeInTheDocument()
    );
  });
});
