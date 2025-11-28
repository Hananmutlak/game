const sequelize = require('../config/database');
const Game = require('./Game');

// العلاقات بين النماذج (إذا كان هناك أكثر من نموذج)

const initializeDatabase = async () => {
  try {
    // اختبار الاتصال
    await sequelize.authenticate();
    console.log('✅ Connected to SQLite database');

    // مزامنة النماذج مع قاعدة البيانات
    await sequelize.sync({ force: false }); // استخدم { force: true } لحذف وإعادة إنشاء الجداول
    console.log('✅ Database synchronized');

    // إضافة بيانات تجريبية إذا كانت الجدول فارغ
    const gameCount = await Game.count();
    if (gameCount === 0) {
      await Game.bulkCreate([
        {
          title: "The Legend of Zelda: Breath of the Wild",
          platform: "Nintendo Switch",
          release_year: 2017,
          price: 59.99,
          completed: true,
          playtime_hours: 85
        },
        {
          title: "Elden Ring",
          platform: "PlayStation 5",
          release_year: 2022,
          price: 69.99,
          completed: false,
          playtime_hours: 42
        },
        {
          title: "Minecraft",
          platform: "PC",
          release_year: 2011,
          price: 26.95,
          completed: true,
          playtime_hours: 156
        }
      ]);
      console.log('✅ Sample games added to database');
    }

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  Game,
  initializeDatabase
};