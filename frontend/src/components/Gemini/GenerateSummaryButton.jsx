import { Button, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';

const GenerateSummaryButton = ({ invoiceId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage(); // ✅ Local message instance

  const generateSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/invoice/${invoiceId}/generate-summary`);
      const json = res.data; // ✅ Fix: access actual data

      if (json.success) {
        messageApi.success('AI Summary generated!');
        onSuccess(json.summary);
      } else {
        messageApi.error('Failed to generate summary.');
      }
    } catch (err) {
      messageApi.error('Error generating summary');
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder} {/* ✅ Inject message context */}
      <Button loading={loading} onClick={generateSummary}>
        Generate AI Summary
      </Button>
    </>
  );
};

export default GenerateSummaryButton;
