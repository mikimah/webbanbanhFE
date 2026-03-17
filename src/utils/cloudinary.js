async function upLoadImage(image){
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ml_default");
    formData.append("cloud_name", "dvrxmp9gm");
    
    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dvrxmp9gm/image/upload", {
            method: "POST",
            body: formData
        });
        
        if (!res.ok) {
            return {
                status: 400,
                url: null,
                message: `Upload failed with status ${res.status}`
            };
        }
        
        const uploadedImageURL = await res.json();

        return {
            status: 200,
            url: uploadedImageURL.secure_url,
            message: "Upload success"
        };
    } catch(e) {
        console.error("Upload error:", e);
        return {
            status: 400,
            url: null,
            message: e.message
        };
    }
}

export { upLoadImage };
