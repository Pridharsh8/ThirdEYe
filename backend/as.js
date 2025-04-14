const { exec } = require("child_process");
const express = require("express");
const app = express();
const PORT = 5000;

app.get("/start-streamlit", (req, res) => {
    // Command to run your Streamlit app
    const command = "streamlit run as.py";

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send("Failed to start Streamlit");
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        res.send("Streamlit started successfully");
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
