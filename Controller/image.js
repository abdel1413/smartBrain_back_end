// const handleImage = (req,res)=>{
//     const { id } = req.body;
    

//     db('users').where('id', '=',id)
//                .increment('entries',1)
//                .returning('entries')
//                .then(entrie =>{
//                 //   console.log(entrie)
//                    res.json(entrie[0])
//                }).catch(err =>res.status(400).json('unable to get entrie'))

// }
// module.exports = {
//     handleImage
// }