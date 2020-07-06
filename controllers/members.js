const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const Intl = require('intl')

//index - lista de members
exports.index = function(req, res) {
    return res.render("members/index", { members: data.members })

}
// show
exports.show = function(req, res) {
    // req.params.id = /:id/:member
    const {id} = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember) return res.send('Member not found..')

    const member = {
        ...foundMember, 
        birth: date(foundMember.birth).birthDay
    }

    // console.log(foundMember.services) // valor do dado
    // console.log(typeof foundMember.services) // valor do dado

    return res.render('members/show', { member })


}
exports.create = function(req, res){
    return res.render('members/create')
}
// create - post
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
        // verificacao se todos os campos estao prenchidos
    const keys = Object.keys(req.body)
    
    for(key of keys){
        //req.body.avatar_url
        if (req.body[key] == '')
        return res.send('Please, fill all fills')
    }
    

    // criando variaveis e setando, sem interven;'ao com user
    birth = Date.parse(req.body.birth)
    let id = 1
    const lastMember = data.members[data.members.length -1] // criando id automatico
    // vai acontecer somente a primeira vez...
    if(lastMember){
        id = lastMember.id + 1
    }

    //[]
    data.members.push({
        id,
        ...req.body,
        birth
    }) // [{...}] [{...},{...},...]
    
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write file erro!')

        return res.redirect('/members')
    })

    // [ "avatar_url", "name","birth","gender","services"]
  //  return res.send(req.body)
}
// edit - pagina
exports.edit = function(req, res) {
     // req.params.id = /:id/:member
     const {id} = req.params

     const foundMember = data.members.find(function(member){
         return member.id == id
     })
 
     if(!foundMember) return res.send('Member not found..')
     
     const member = {
         ...foundMember,
         birth: date(foundMember.birth).iso
     }

         
    console.log(member.birth) // valor do dado


    return res.render('members/edit', { member } )
}
// put - manda banco atualizado
exports.put = function(req, res){
    const { id } = req.body

    let index = 0
    // func aceita dois paramentros, outro seria a posicao - index
    const foundMember = data.members.find(function(member, foundIndex){
        if (member.id == id){
            index = foundIndex
            return true
        }
    })

    if(!foundMember) return res.send('Member not found..')
    
    const member = {
        ...foundMember,
        ...req.body, // recupero todos os dados alterados do meu body
        birth: Date.parse(req.body.birth), // pegando minha dada e atualizando - niver
        id: Number(req.body.id) // sempre ser um numero
    }

    // escrever no meu arquivo
    data.members[index] = member
    
    // fs.writeFile('data.json'. JSON.stringify(data, null,2), function(err){

    //     return res.redirect(`/member/${ id }`)
    // })
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write file erro!')

        // return res.redirect('/members')
        return res.redirect(`/members/${ id }`)
    })

}
// delete
exports.delete = function(req, res){

    const { id } = req.body

    // funcao para fazer o filtro, onde estou retirando meu member
    const filteredMembers = data.members.filter(function( member ){

        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        return res.redirect('/members')
    })
}