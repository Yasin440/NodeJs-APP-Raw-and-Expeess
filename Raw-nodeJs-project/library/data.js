//dependencies
const fs = require('fs');
const path = require('path');

//config scaffolding
const library = {};

//base directory for data folder
library.basedir = path.join(__dirname, '/../.data/');

//write data to file
library.create = (directory, file, data, callBack) => {
    //For writing open folder
    fs.open(`${library.basedir + directory}/${file}.json`, 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            //convert data to string
            const stringData = JSON.stringify(data);
            //write data to file and close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callBack(false);
                        } else {
                            callBack('Error closing to new file!');
                        }
                    });
                } else {
                    callBack('Error writing to new file!');
                }
            });
        } else {
            callBack('Could not create new file, it may be already exists!');
        }
    });
};

//read data from file
library.read = (directory, file, callBack) => {
    fs.readFile(`${library.basedir + directory}/${file}.json`, 'utf8', (err, data) => {
        callBack(err, data);
    });
};

//update existing file
library.update = (directory, file, data, callBack) => {
    //OPEN file for update
    fs.open(`${library.basedir + directory}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            //convert data to string
            const stringData = JSON.stringify(data);
            //truncate the file
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    //write (update) the file and close
                    fs.write(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            //close
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callBack(`error=${false}`);
                                } else {
                                    callBack('Find error to closing(update) the file!')
                                }
                            });
                        } else {
                            callBack('Find error to Writing(update) the file!')
                        }
                    });
                } else {
                    callBack('Fond error to truncating the file!')
                }
            });
        } else {
            callBack('file not exist to update!')
        }
    });
};

//delete the existing file
library.delete = (directory, file, callBack) => {
    //unlink file(DELETE)
    fs.unlink(`${library.basedir + directory}/${file}.json`, (err) => {
        if (!err) {
            callBack(`Error on delete = ${false}`);
        } else {
            callBack('Find error on deleting file!');
        }
    });
};

module.exports = library;