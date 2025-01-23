const fs = require('fs-extra');

const listFolderCopy = [
    {
        sourceDirectory: "views",
        targetDirectory: "dist/views"
    },
    {
        sourceDirectory: "public",
        targetDirectory: "dist/public"
    },
]

listFolderCopy.forEach(item => {
    fs.copy(item.sourceDirectory, item.targetDirectory, (error) => {
        if(error) {
            console.error(`Error copying files from ${item.sourceDirectory} to ${item.targetDirectory}:`, error);
        } else {
            console.log(`Successfully copied files from ${item.sourceDirectory} to ${item.targetDirectory}`);
        }
    })
})