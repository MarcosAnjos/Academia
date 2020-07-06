const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const Intl = require('intl')

//index - lista de instructors
exports.index = function(req, res) {
    return res.render("instructors/index", { instructors: data.instructors })

}

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

exports.create = function(req, res){
    return res.render('instructors/create')
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
    const id = Number(data.instructors.length + 1) // criando id automatico

    // let id = 1
    // const lastIsntructors = data.isntructors[data.isntructors.length -1] // criando id automatico
    // // vai acontecer somente a primeira vez...
    // if(lastMember){
    //     id = lastIsntructors.id + 1
    // }

    //[]
    data.instructors.push({
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

// edit - pagina
exports.edit = function(req, res) {
     // req.params.id = /:id/:member
     const {id} = req.params

     const foundInstructor = data.instructors.find(function(instructor){
         return instructor.id == id
     })
 
     if(!foundInstructor) return res.send('Instructor not found..')
     
     const instructor = {
         ...foundInstructor,
         birth: date(foundInstructor.birth).iso
     }

         
    console.log(instructor.birth) // valor do dado


    return res.render('instructors/edit', { instructor } )
}

// put - manda banco atualizado
exports.put = function(req, res){
    const { id } = req.body

    let index = 0
    // func aceita dois paramentros, outro seria a posicao - index
    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if (instructor.id == id){
            index = foundIndex
            return true
        }
    })

    if(!foundInstructor) return res.send('Instructor not found..')
    
    const instructor = {
        ...foundInstructor,
        ...req.body, // recupero todos os dados alterados do meu body
        birth: Date.parse(req.body.birth), // pegando minha dada e atualizando - niver
        id: Number(req.body.id) // sempre ser um numero
    }

    // escrever no meu arquivo
    data.instructors[index] = instructor
    
    // fs.writeFile('data.json'. JSON.stringify(data, null,2), function(err){

    //     return res.redirect(`/instructor/${ id }`)
    // })
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write file erro!')

        // return res.redirect('/instructors')
        return res.redirect(`/instructors/${ id }`)
    })

}

// delete
exports.delete = function(req, res){

    const { id } = req.body

    // funcao para fazer o filtro, onde estou retirando meu instructor
    const filteredInstructors = data.instructors.filter(function( instructor ){

        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        return res.redirect('/instructors')
    })
}