import mongoose from "mongoose";

type connectionObject = {
    isConnected? : number
};

const connection: connectionObject = {};

export async function dbConnection() {
    try {
        if (connection.isConnected) {
            console.log("Already connected to the database");
            return;
        }
        const db = await mongoose.connect(process.env.MONGO_URI?? '');
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to the database");
    } catch (error) {
        console.log("Error connecting to the database", error);
    }
}