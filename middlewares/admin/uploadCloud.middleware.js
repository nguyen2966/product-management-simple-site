const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier")

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRECT // Click 'View API Keys' above to copy your API secret
});
// End Cloudinary configuration

module.exports.upload = (req, res, next) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            req.body[req.file.fieldname] = result.secure_url
            next();
            // Tổng quát, bên front end gửi name bất kì
            // set đường dẫn sang đường dẫn online
        }
        upload(req);

    } else next();
    // go to next controller if user did not upload image
}