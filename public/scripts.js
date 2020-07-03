// selecionando os card
const cards = document.querySelectorAll('.cards')

// cada card um click
for (let card of cards) {
    card.addEventListener('click', function(){
        const receitaid = card.getAttribute("id")
        window.location.href =  `/receita?id=${ receitaid }`

    })
}
