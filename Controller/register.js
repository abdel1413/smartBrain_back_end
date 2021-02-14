 const handleRegister = (req, res, db,bcrypt )=>{

    //add new input to database
    const { name,email, password } = req.body;
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

module.exports = {
    handleRegister : handleRegister
}