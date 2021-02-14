const getProfile =(req, res,db,)=>{
   
    const { id } = req.params // grab whatever id you put in browser
    
   db.select('*').from('users').where({
       id:id   //we can user ES6 {id} ////{id:id} ==> {id}
   }).then(response =>{
       if(response.length){
      // console.log(response);
       res.json(response[0]);
    }else{
           res.status(400).json('Not found')
       }
   }).catch(res.status(400).json('Error getting user'))
}

module.exports = {
    getProfile
}