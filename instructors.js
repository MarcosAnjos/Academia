const fs = require('fs')
const data = require('./data.json')
const { age, date } = require('./utils')
const Intl = require('intl')

// show
exports.show = function(req, res) {
    // req.params.id = /:id/:member
    const {id} = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundInstructor) return res.send('Instructor not found..')

    const instructor = {
        ...foundInstructor, 
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    // console.log(foundInstructor.services) // valor do dado
    // console.log(typeof foundInstructor.services) // valor do dado

    return res.render('instructors/show', { instructor })


}


// create
exports.post = function(req, res) {
    // req.query = 

    // req.body = pega os valores do nosso obj
    /*{
        "avatar_url": "https://images.unsplash.com/photo-1548690312-e3b507d8c110?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
        "name": "MARCOS ALEXANDRE DOS ANJOS",
        "birth": "2020-11-11",
        "gender": "M",
        "services": "as,assa"
    */

    const keys = Object.keys(req.body)
    
    for(key of keys){
        //req.body.avatar_url
        if (req.body[key] == '')
        return res.send('Please, fill all fills')
    }
    
    // desestruturtação do obj
    let { avatar_url, birth, name, services, gender } =  req.body

    // criando variaveis e setando, sem interven;'ao com user
    birth = Date.parse(birth)
    const created_at =  Date.now()
    const id = Number(data.isntructors.length + 1) // criando id automatico

    //[]
    data.isntructors.push({
        id, 
        avatar_url, 
        name,
        birth,
        gender, 
        services, 
        created_at
    }) // [{...}] [{...},{...},...]
    
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write file erro!')

        return res.redirect('/instructors')
    })

    // [ "avatar_url", "name","birth","gender","services"]
  //  return res.send(req.body)
}

// edit

exports.edit = function(req, res) {
     // req.params.id = /:id/:member
     const {id} = req.params

     const foundInstructor = data.instructors.find(function(instructor){
         return instructor.id == id
     })
 
     if(!foundInstructor) return res.send('Instructor not found..')
     
     const instructor = {
         ...foundInstructor,
         birth: date(foundInstructor.birth)
     }

         
    console.log(instructor.birth) // valor do dado


    return res.render('instructors/edit', { instructor } )
}
