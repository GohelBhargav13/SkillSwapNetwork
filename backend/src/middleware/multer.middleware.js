import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/images")
    },
    filename:function(req,file,cb){
        const fileName = `User_avatar_${req.body.name}${path.extname(file.originalname)}`
        cb(null,fileName)
        console.log(file)
    }
})

export const upload = multer({ storage })