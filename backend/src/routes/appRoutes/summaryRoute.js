const express = require('express');
const router = express.Router();
const { getGeminiSummary } = require('../../utils/gemini');
const mongoose = require('mongoose');
const Model = mongoose.model('Invoice');

router.post('/:id/generate-summary', async (req, res) => {
  try {
    const invoice = await Model.findOne({
      _id: req.params.id,
      removed: false,
    })
      .populate('createdBy', 'name')
      .exec();

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Filter items with notes
    const itemsWithNotes = invoice.items.filter(item => item.notes && item.notes.trim() !== '');

    // If no notes found, send empty notes to API
    const notes = itemsWithNotes.length === 0 
      ? ''
      : itemsWithNotes.map((item, index) =>
          `Item ${index + 1}: ${item.itemName} - ${item.notes}`
        ).join('\n');

    const summary = await getGeminiSummary(notes);    

    invoice.geminiSummary = summary;
    await invoice.save();

    res.json({ success: true, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
