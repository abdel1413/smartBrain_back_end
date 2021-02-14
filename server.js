//to install  nodemon : npm install nodem --save-dev
//to create packg.json : npm init -y
//to create name.js(module) : touch name.js
//to run :node name.js


const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
 const cors = require('cors')
 const knex = require('knex');
const { reset } = require('nodemon');
const { response } = require('express');
const register = require('./Controller/register');
const signin = require('./Controller/signin');
const profile = require('./Controller/profile');
const image = require('./Controller/image')

  const db= knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'aboulayetchakoura',
      password : '',
      database : 'smart-brain-db'
    }
  });
  
  //access users & console out
// db.select('*').from('users').then(console.log);



const app = express();

app.use(bodyParser.json())
app.use(cors())

// const database = {
//     users:[
//              {
//                  id: '123',
//                  name: 'john',
//                  email: 'john@gmail.com',
//                  password: 'johnny',
//                  entries: 0,
//                  joined: new Date()

//              },
//              {
//                  id:'124',
//                  name: 'bob',
//                  email: 'bob@gmail.com',
//                  password: 'bobby',
//                  entries: 0,
//                  joined: new Date()


//              }
//            ],
//            login:[
//                {
//                    id:'987',
//                    hash:'',
//                    email:'john@gmail.com'
//                }
//            ]
// }
   
 

app.get('/',(req,res)=>{res.send(database.users)})

//more advanced
//app.post('/signin', (req,res) =>{signin.handleSignin(db,bcrypt)(req,res)}) //calls (db,bcrypt) then (req,res)
app.post('/signin',(req,res)=>{
    //   res.send('success') ==== res.json('success')
    
    // bcrypt.compare('anny','$2a$10$3QNw1yK79kli.HHPVBTxDOf1GLMVZ1rOLbqNpkAnuZfL/Iun9xgNG',function(err,res){
    //     console.log('1 guess',res)
        
    // })

    // bcrypt.compare("wron",'$2a$10$3QNw1yK79kli.HHPVBTxDOf1GLMVZ1rOLbqNpkAnuZfL/Iun9xgNG',function(err,res){
    //        console.log('2 guess',res)
    // })


    //use database to acces users
    // if( req.body.email === database.users[0].email && req.body.password === database.users[0].password ){
    //     //res.json('successful signed in')
    //       res.json(database.users[0]);

    // }else{
    //     res.status(404).json('bad cred!. Error logging in')
    //}

    db.select('email','hash').from('login')
      .where('email','=' , req.body.email)
      .then(response =>{
          const getAnswer = bcrypt.compareSync(req.body.password ,response[0].hash);
        //   console.log(getAnswer)

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


})

                                                                 //inject db , bcrypt
//app.post('/register',(req,res)=> {register.handleRegister(req,res, db, bcrypt )})

app.post('/register',(req, res )=>{

    //add new input to database
    const { name,email, password } = req.body;
   // bcrypt.hash(password,null,null,function(error,hash){
        // console.log(hash)
   // })
    
    
    // database.users.push({
    //     id:'125',
    //     name: name,
    //     email: email,
    //     entries:0,
    //     joined: new Date()
    // }
    // )

    const hash =bcrypt.hashSync(password)
    db.transaction(trx =>{
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(async loginEmail =>{
                const user = await trx('users')
                    .returning('*') //ret obj to front end
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    });
                res.json(user[0]); //always return current item in array
    })
    .then(trx.commit)
    .catch(trx.rollback)

    })
    .catch(err =>res.status(400).json('failed to register'))

    //res.json(database.users[database.users.length-1])
}
)



//ouput the user
//app.get('/profile/:id',(req,res) => {profile.getProfile(req,res,db)})
app.get('/profile/:id',(req, res)=>{
   
    const { id } = req.params // grab whatever id you put in browser
    //  let found = false;
    // database.users.forEach(user =>{
    //     if(user.id === id){
    //      found = true;
    //         return res.json(user);

    //     }
    // })
    // if(!found){
    //     res.status(400).json("user not found")
    // }
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
})



 //increment entries every time the user input an image link
 //app.put('/image', (req,res) =>{image.handleImage(req,res,db)})
app.put('/image',(req,res)=>{
    const { id } = req.body;
    // let found = false;
    // database.users.forEach(user =>{
    //     if(user.id === id){
    //         found = true;
    //         user.entries++;
    //         return res.json(user)
    //     }
    // })
    // if(!found){
    //     return res.status(404).json('user not found')
    // }

    db('users').where('id', '=',id)
               .increment('entries',1)
               .returning('entries')
               .then(entrie =>{
                //   console.log(entrie)
                   res.json(entrie[0])
               }).catch(err =>res.status(400).json('unable to get entrie'))

})

app.listen(3000, ()=>{
    console.log("app is running on port 3000");
});



// Routes squeleton
//1 --> res  //this app is working
// 2 signin : --> post :success/fail
//3 register: --> post: user
//4  profile/: userId --> get :user
//5 image: -->put : user