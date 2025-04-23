import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Drawer, List, Input, Button, Space, Typography, message } from 'antd';
import useLanguage from '@/locale/useLanguage';

const { TextArea } = Input;
const { Text } = Typography;

const QueryNotes = ({ visible, onClose, query, onAddNote, onDeleteNote }) => {
  const translate = useLanguage();
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNote = async () => {
    const trimmedNote = newNote.trim();
    if (!trimmedNote) {
      message.error(translate('please_enter_note'));
      return;
    }

    setLoading(true);
    try {
      await onAddNote(query?._id, trimmedNote);
      setNewNote('');
      message.success(translate('note_added_success'));
    } catch {
      message.error(translate('failed_to_add_note'));
    } finally {
      setLoading(false);
    }
  };

  const notes = useMemo(() => query?.notes || [], [query]);

  return (
    <Drawer
      title={`${translate('notes_for')} ${query?.customerName || ''}`}
      width={720}
      onClose={onClose}
      open={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          rows={4}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={translate('enter_note')}
        />
        <Button type="primary" onClick={handleAddNote} loading={loading}>
          {translate('add_note')}
        </Button>

        <List
          dataSource={notes}
          renderItem={(note) => (
            <List.Item
              key={note._id}
              actions={[
                <Button
                  type="text"
                  danger
                  onClick={() => onDeleteNote(query._id, note._id)}
                >
                  {translate('delete')}
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={new Date(note.createdAt).toLocaleString()}
                description={<Text>{note.content}</Text>}
              />
            </List.Item>
          )}
        />
      </Space>
    </Drawer>
  );
};

QueryNotes.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  query: PropTypes.shape({
    _id: PropTypes.string,
    customerName: PropTypes.string,
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        content: PropTypes.string,
        createdAt: PropTypes.string,
      })
    ),
  }),
};

export default QueryNotes;
