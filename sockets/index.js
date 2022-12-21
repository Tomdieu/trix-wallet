
const Socket = (server) =>{

    const io = require("socket.io")(server,{
        cors:{
            origin:'*'
        }
    })

    // io.use(async (socket,next)=>{
    //     if(socket.handshake.query && socket.handshake.query.token){
    //         const {token} = socket.handshake.query;
    //         const {Token,User} = require('../models')
    //         const tk = await Token.findOne({ where: { key: token } ,include:User});

    //         if(tk){
    //             socket.user = tk.user;
    //             next()
    //         }
    //         else{
    //             return  next(new Error('Authentication error'));
    //         }
    //     }
    //     else{
    //         next(new Error('Authentication error'));
    //     }
    // })

    io.on("connection",socket=>{
        console.log("Someone connected")
    
        socket.on("send_message",({userId,message})=>{
            console.log(userId,token,message)
            socket.to(userId).emit("message",message)
        })

        socket.on('disconnect',()=>{
            console.log("A user discnnected")
            socket.leave()
        })

    })
}

// const configureSocket = (io,socket)=>{
//     return {userNotification}
// }

// const onConnection = (io) => (socket) =>{
//     const {userNotification} = 
// }


module.exports = Socket