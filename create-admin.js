const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ownerModel = require('./models/owner-model');
const userModel = require('./models/user-model');
require('dotenv').config();
const config = require('config');

async function createAdmin() {
    try {
        const dbUri = `${config.get("MONGODB_URI")}/scratch`;
        console.log(`Connecting to database at ${dbUri}...`);
        await mongoose.connect(dbUri);
        console.log("Connected successfully to MongoDB.");

        const owners = await ownerModel.find();
        const email = "admin@gmail.com";
        const password = "admin";
        const fullname = "Admin User";

        console.log("Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        if (owners.length > 0) {
            console.log("\nFound existing owner(s) in the database:");
            owners.forEach((owner, idx) => {
                console.log(`[${idx + 1}] Name: ${owner.fullname}, Email: ${owner.email}, isAdmin: ${owner.isadmin}`);
            });

            console.log("\nResetting the password of the first admin to 'admin' for convenience...");
            const firstOwner = owners[0];
            firstOwner.password = hash;
            await firstOwner.save();

            console.log("==========================================");
            console.log("Password Reset Successfully!");
            console.log(`Email: ${firstOwner.email}`);
            console.log(`Password: ${password}`);
            console.log("==========================================\n");
            process.exit(0);
        }

        console.log("Creating owner doc...");
        await ownerModel.create({
            fullname,
            email,
            password: hash,
            isadmin: true
        });

        console.log("Creating matching user doc...");
        await userModel.create({
            fullname,
            email,
            password: hash,
            contact: "1234567890"
        });

        console.log("\n==========================================");
        console.log("Dummy admin created successfully!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log("==========================================\n");
        process.exit(0);
    } catch (err) {
        console.error("Error creating/updating admin:", err);
        process.exit(1);
    }
}

createAdmin();
