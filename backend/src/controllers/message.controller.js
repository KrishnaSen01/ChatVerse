import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getUserFromSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUser);
  } catch (error) {
    console.log("err in getUserFromSidebar (messRoute):- ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const {id:userToChatId} = req.params.id;
    const myId = req.user._id;

    const message = await Message.find({
        $or:[
            {senderId: myId, receiverId: userToChatId},
            {senderId: userToChatId, receiverId: myId},
        ]
    })

    return res.status(200).json(Message)

  } catch (error) {
    console.log("err in getMessage (messRoute):- ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};


export const sendMessage = async (req,res)=>{
    try{
        const {text, image} = req.body;
        const {id:receiverId} = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            image = uploadResponse.secure_url();
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();

        //todo: real time functionality goes here => socket.io
            
        return res.status(201).json(newMessage);


    }catch(error){
        console.log("err in sendMessage (messRoute):- ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
}