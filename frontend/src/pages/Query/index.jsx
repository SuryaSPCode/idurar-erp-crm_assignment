import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Card, Tag, Typography, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import { useNavigate } from 'react-router-dom';
import { ErpLayout } from '@/layout';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const QueryManager = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [status, setStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingQuery, setEditingQuery] = useState(null);
  const [noteText, setNoteText] = useState('');
  const translate = useLanguage();

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/queries`, {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          status: status
        }
      });

      if (response.data.success) {
        setQueries(response.data.result);
        setPagination({
          ...pagination,
          total: response.data.total
        });
      } else {
        message.error(response.data.error || translate('failed_to_load_queries'));
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error || translate('failed_to_load_queries'));
      } else if (error.request) {
        message.error(translate('network_error'));
      } else {
        message.error(translate('failed_to_load_queries'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [pagination.current, status]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingQuery(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingQuery) {
        const response = await axios.patch(`${API_BASE_URL}/queries/${editingQuery._id}`, values);

        if (response.data.success) {
          setQueries(prevQueries => 
            prevQueries.map(query => 
              query._id === editingQuery._id 
                ? response.data.result 
                : query
            )
          );

          message.success(translate('query_updated_success'));
          handleCancel();
        } else {
          message.error(response.data.error || translate('failed_to_update_query'));
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/queries`, values);        

        if (response.data.success) {
          message.success(translate('query_created_success'));
          fetchQueries();
          handleCancel();
        } else {
          message.error(response.data.error || translate('failed_to_create_query'));
        }
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error || translate(editingQuery ? 'failed_to_update_query' : 'failed_to_create_query'));
      } else if (error.request) {
        message.error(translate('network_error'));
      } else {
        message.error(translate(editingQuery ? 'failed_to_update_query' : 'failed_to_create_query'));
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/queries/${id}`);

      if (response.data.success) {
        message.success(translate('query_deleted_success'));
        fetchQueries();
      } else {
        message.error(response.data.error || translate('failed_to_delete_query'));
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error || translate('failed_to_delete_query'));
      } else if (error.request) {
        message.error(translate('network_error'));
      } else {
        message.error(translate('failed_to_delete_query'));
      }
    }
  };

  const handleAddNote = async (queryId) => {
    if (!noteText.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/queries/${queryId}/notes`, {
        content: noteText
      });

      if (response.data.success) {
        message.success(translate('note_added_success'));
        setNoteText('');
        fetchQueries();
      } else {
        message.error(response.data.error || translate('failed_to_add_note'));
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error || translate('failed_to_add_note'));
      } else if (error.request) {
        message.error(translate('network_error'));
      } else {
        message.error(translate('failed_to_add_note'));
      }
    }
  };

  const handleDeleteNote = async (queryId, noteId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/queries/${queryId}/notes/${noteId}`);

      if (response.data.success) {
        message.success(translate('note_deleted_success'));
        fetchQueries();
      } else {
        message.error(response.data.error || translate('failed_to_delete_note'));
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error || translate('failed_to_delete_note'));
      } else if (error.request) {
        message.error(translate('network_error'));
      } else {
        message.error(translate('failed_to_delete_note'));
      }
    }
  };

  const columns = [
    {
      title: translate('customer_name'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: '15%',
    },
    {
      title: translate('description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: '25%',
    },
    {
      title: translate('created_date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      width: '15%',
    },
    {
      title: translate('status'),
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status) => (
        <Tag color={
          status === 'Open' ? 'blue' :
          status === 'InProgress' ? 'orange' :
          status === 'Resolved' ? 'green' :
          'red'
        }>
          {translate(status)}
        </Tag>
      ),
    },
    {
      title: translate('resolution'),
      dataIndex: 'resolution',
      key: 'resolution',
      ellipsis: true,
      width: '15%',
    },
    {
      title: translate('actions'),
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingQuery(record);
              form.setFieldsValue(record);
              showModal();
            }}
          >
            {translate('edit')}
          </Button>
          <Popconfirm
            title={translate('delete_query_confirm')}
            onConfirm={() => handleDelete(record._id)}
            okText={translate('yes')}
            cancelText={translate('no')}
          >
            <Button danger icon={<DeleteOutlined />}>
              {translate('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ErpLayout>
      <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
                style={{ padding: 0 }}
              />
              <Title level={4} style={{ margin: 0 }}>{translate('queries')}</Title>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                onChange={handleStatusChange}
              >
                <Option value="all">{translate('all')}</Option>
                <Option value="Open">{translate('Open')}</Option>
                <Option value="InProgress">{translate('InProgress')}</Option>
                <Option value="Resolved">{translate('Resolved')}</Option>
                <Option value="Closed">{translate('Closed')}</Option>
              </Select>
              <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
                {translate('add_new_query')}
              </Button>
            </Space>
          </Col>
        </Row>

        <div style={{ marginTop: '16px' }}>
          <Table
            columns={columns}
            dataSource={queries}
            rowKey="_id"
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            size="middle"
            expandable={{
              expandedRowRender: (record) => (
                <Card title={translate('notes')} style={{ margin: '16px 0' }}>
                  <div style={{ marginBottom: 16 }}>
                    <TextArea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder={translate('add_note_placeholder')}
                      rows={4}
                    />
                    <Button
                      type="primary"
                      onClick={() => handleAddNote(record._id)}
                      style={{ marginTop: 8 }}
                    >
                      {translate('add_note')}
                    </Button>
                  </div>
                  {record.notes?.map((note) => (
                    <Card
                      key={note._id}
                      style={{ marginBottom: 8 }}
                      extra={
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteNote(record._id, note._id)}
                        />
                      }
                    >
                      <p>{note.content}</p>
                      <small>
                        {note.createdDate ? new Date(note.createdDate).toLocaleString() : 'Invalid date'}
                      </small>
                    </Card>
                  ))}
                </Card>
              ),
            }}
          />
        </div>

        <Modal
          title={editingQuery ? translate('edit_query') : translate('add_new_query')}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width="90%"
          style={{ maxWidth: '600px' }}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              name="customerName"
              label={translate('customer_name')}
              rules={[{ required: true, message: translate('customer_name_required') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label={translate('description')}
              rules={[{ required: true, message: translate('description_required') }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="status"
              label={translate('status')}
              rules={[{ required: true, message: translate('status_required') }]}
            >
              <Select>
                <Option value="Open">{translate('Open')}</Option>
                <Option value="Inprogress">{translate('InProgress')}</Option>
                <Option value="Resolved">{translate('Resolved')}</Option>
                <Option value="Closed">{translate('Closed')}</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="resolution"
              label={translate('resolution')}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {editingQuery ? translate('update') : translate('create')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ErpLayout>
  );
};

export default QueryManager; 