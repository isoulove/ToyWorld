import rf from 'fs';

class FileService {
  setUploadImg(imgData: any) : any {
    let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    let timer = Number( new Date() );
    rf.writeFileSync("../web/public/static/images/products/p"+timer+".png",dataBuffer);
    return {"code":100,"verson":true,"url":"/static/images/products/p"+timer+".png"};
  }
}

export { FileService };