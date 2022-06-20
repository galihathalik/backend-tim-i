export class Helper {
    static customFileName(req, file, cb){
        let customFile = file.originname.split(',')[0];
        customFile = 
            customFile + Date.now() + '-' + Math.round(Math.random() * 1e9);
        let fileExtension = '';
        if (file.mimetype.indexOf('jpg') > -1) {
            fileExtension = '.jpg';
        } else if (file.mimetype.indexOf('png') > -1) {
            fileExtension = '.png';
        }

        customFile = customFile + fileExtension;
        cb(null, customFile);
    }
    static filePath(req, file, cb) {
        cb(null,'./uploads/');
    }
}