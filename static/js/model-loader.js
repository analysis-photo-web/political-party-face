var model

(async () => {
    const modelPath = "./static/model/";
    const modelURL = modelPath + "model.json";
    const metadataURL = modelPath + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
})();
