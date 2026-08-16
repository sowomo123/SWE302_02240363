const { createApp } = require('./src/app');
const { createStore } = require('./src/store');

const store = createStore();
const app = createApp(store);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CST College Student Management System running at http://localhost:${PORT}`);
});
