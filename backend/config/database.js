const mongoose = require("mongoose");
require("dotenv").config();

async function startDatabase() {
    const { DB_USER, DB_PASS, DB_NAME } = process.env;
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@estudo.gr0mbz4.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Conectado ao MongoDB Atlas");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = startDatabase;
