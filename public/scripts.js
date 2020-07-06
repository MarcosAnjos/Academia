// pegar a pagina que estou - deixar selecionado o menu
const currentPage = location.pathname
const menuItems = document.querySelectorAll('header .links a')

for(item of menuItems){
    // se meu nome do href ==  com meu nome ques estou pegando
    if(currentPage.includes(item.getAttribute('href'))){
        item.classList.add('active')
    }
}