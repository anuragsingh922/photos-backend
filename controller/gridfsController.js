const { MongoClient, GridFSBucket } = require("mongodb");
const fs = require("fs");
const { databaseuri } = require("../config");
const path = require("path");
const { Readable } = require("stream");

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const client = await MongoClient.connect(databaseuri);
  const db = client.db("test"); // Replace with your database name
  const bucket = new GridFSBucket(db);

  try {
    const email = req.user;
    console.log(email);
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    // Create a readable stream from the file buffer
    const readableStream = Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    // Open a GridFS upload stream
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { contentType: req.file.mimetype, email: email },
    });

    readableStream
      .pipe(uploadStream)
      .on("error", (error) => {
        console.error("Error uploading file:", error);
        return res
          .status(500)
          .json({ success: false, message: "Error uploading file" });
      })
      .on("finish", () => {
        console.log("File uploaded successfully");
        client.close();
        return res.status(200).json({
          success: true,
          message: "File saved successfully.",
          fileId: uploadStream.id,
        });
      });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const uploadVideo = async (req, res) => {
  const user = req.user;

  const client = await MongoClient.connect(database_uri);
  const db = client.db("askfluence");
  const bucket = new GridFSBucket(db);

  const filePath = path.join(__dirname, "1727444231129.png");

  //   const data = fs.readFileSync(filePath , "utf-8");
  //   console.log(data);
  //   return res.status(200).send(data);

  // Create a readable stream from the file
  const uploadStream = bucket.openUploadStream(filePath);

  // Pipe the file into the GridFS bucket
  fs.createReadStream(filePath)
    .pipe(uploadStream)
    .on("error", (error) => {
      console.error("Error uploading file:", error);
    })
    .on("finish", () => {
      console.log("File uploaded successfully");
      client.close();
      return res.status(200).json({
        success: true,
        message: "File Saved Successfully.",
      });
    });
};

const getAllFiles = async (req, res) => {
  const email = req.user;
  console.log("Email : ", email);

  const client = await MongoClient.connect(databaseuri);
  const db = client.db("test");
  const bucket = new GridFSBucket(db);
  try {
    // Find all files associated with the specified email
    const files = await db
      .collection("fs.files")
      .find({ "metadata.email": email })
      .toArray();

    console.log("Database res : ", files);

    if (!files || files.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No files found for this email" });
    }

    // Read the content of each file into a buffer
    const filePromises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const fileId = file._id;
          const downloadStream = bucket.openDownloadStream(fileId);

          let buffer = Buffer.alloc(0);

          downloadStream.on("data", (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);
          });

          downloadStream.on("end", () => {
            resolve({
              filename: file.filename,
              contentType: file.metadata.contentType,
              data: buffer.toString("base64"), // Encode file data as Base64 string
            });
          });

          downloadStream.on("error", (error) => {
            console.error("Error reading file:", error);
            reject(error);
          });
        })
    );

    const fileData = await Promise.all(filePromises);

    console.log("FileData : ", fileData);

    res.status(200).json({
      success: true,
      message: `Found ${fileData.length} file(s) associated with this email.`,
      files: fileData,
    });
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    client.close();
  }
};

const getAllFiles2 = async (req, res) => {
  const email = req.user;
  console.log("Email : ", email);

  const client = await MongoClient.connect(databaseuri);
  const db = client.db("test");
  const bucket = new GridFSBucket(db);

  try {
    // Find all files associated with the specified email
    const files = await db
      .collection("fs.files")
      .find({ "metadata.email": email })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found for this email",
      });
    }

    // Set up the response headers for JSON streaming
    res.setHeader("Content-Type", "application/json");

    // Use an async function to handle each file separately
    for (const file of files) {
      const fileId = file._id;
      const downloadStream = bucket.openDownloadStream(fileId);

      let base64Data = "";

      // This returns a promise that resolves once the file has finished downloading
      await new Promise((resolve, reject) => {
        downloadStream.on("data", (chunk) => {
          base64Data += chunk.toString("base64");
        });

        downloadStream.on("end", () => {
          // Write file metadata along with the Base64 data
          const fileData = JSON.stringify({
            filename: file.filename,
            contentType: file.metadata.contentType,
            data: base64Data,
          });

          res.write(fileData);
          resolve(); // Resolve the promise when this file's download is complete
        });

        downloadStream.on("error", (error) => {
          console.error("Error reading file:", error);
          reject(error); // Reject the promise in case of an error
        });
      });

      base64Data = ""; // Clear the buffer for the next file
      isFirstFile = false;
    }

    res.end();
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    client.close();
  }
};

module.exports = { uploadFile, getAllFiles };
