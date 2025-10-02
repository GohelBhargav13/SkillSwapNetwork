import multer from "multer";

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,`./public/postimages`)
    },
    filename:function(req,file,cb){
        const filename = `User_${req.user.name}_Post_${req.body.title}_${file.originalname}`;
        cb(null,filename)
    }
})

export const uploadForPost = multer({ storage })