const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const message = require("../models/message");
const Chat = require('./../models/chat');
const mongoose = require('mongoose'); 

router.post('/create-new-chat', authMiddleware, async (req, res) => {
    try{
        const chat = new Chat(req.body);
        const savedChat = await chat.save();

        res.status(201).send({
            message: 'Chat created successfully',
            success:true,
            data: savedChat
        })
    }catch(error){
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.get('/get-all-chats', authMiddleware, async (req, res) => {
    try{
        const userId = req.userId;   
        const allChats = await Chat.find({members: {$in: userId}})
                                   .populate('members')
                                   .populate('lastMessage')
                                   .sort({updatedAt: -1});
       

        res.status(200).send({
            message: 'Chat fetched successfully',
            success:true,
            data: allChats
        })
    }catch(error){
        console.log('ERROR:', error.message);
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.post('/clear-unread-message', authMiddleware, async (req, res) => {
  try {
    const chatId = req.body.chatId;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.send({
        message: "No Chat Found with given chat ID.",
        success: false
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { unreadMessageCount: 0 },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");

    await message.updateMany(
      { chatId: chatId, read: false },
      { read: true }
    );

    res.send({
      message: "Unread message cleared successfully",
      success: true,
      data: updatedChat
    });

  } catch (error) {
    res.send({
      message: error.message,
      success: false
    });
  }
});


module.exports = router;