 const handleSignin = (db,bcrypt)=> (req,res) =>{  //more advanced
   
    db.select('email','hash').from('login')
      .where('email','=' , req.body.email)
      .then(response =>{
          const getAnswer = bcrypt.compareSync(req.body.password ,response[0].hash);
          console.log(getAnswer)

          if(getAnswer){
              return db.select('*').from('users')
                        .where('email', '=', req.body.email)
                        .then(user =>{
                            res.json(user[0])
                        })
                        .catch(err => res.status(400).json('unable to get user'))
          }else{
              res.status(400).json('wrong credential')
          }
 
           
      })
      .catch(err => res.status(400).json('wrong credential'))


}
module.exports ={
    handleSignin:handleSignin
}
