const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://penteai:5C6ZRGyocGY5eMOp@clusterpenteai.3y3ff7d.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPenteAi')
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
