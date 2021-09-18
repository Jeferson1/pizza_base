let cart = [];
let modalQtd = 1;
let modalKey = 0

const getElement = element => document.querySelector(element);
const getElements = element => document.querySelectorAll(element);

// Listagem das pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = getElement('.models .pizza-item').cloneNode(true);

  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = '/assets/' + item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

  pizzaItem.querySelector('a').addEventListener('click', event => {
    event.preventDefault();

    let key = event.target.closest('.pizza-item').getAttribute('data-key');

    modalQtd = 1;
    modalKey = key

    getElement('.pizzaBig img').src = '/assets/' + pizzaJson[key].img;
    getElement('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    getElement('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    getElement('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
    
    getElement('.pizzaInfo--size.selected').classList.remove('selected');
    
    getElements('.pizzaInfo--size').forEach((size, sizeIndex) => {
      sizeIndex == 2 ? size.classList.add('selected') : ''
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    })

    getElement('.pizzaInfo--qt').innerHTML = modalQtd;

    getElement('.pizzaWindowArea').style.opacity = 0;
    getElement('.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => getElement('.pizzaWindowArea').style.opacity = 1, 200);
  });

  getElement('.pizza-area').append(pizzaItem);
})

// Eventos do MODAL
closeModal = () => { 
  getElement('.pizzaWindowArea').style.opacity = 0; 
  setTimeout(() => getElement('.pizzaWindowArea').style.display = 'none', 500)
}

getElements('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton')
.forEach(item => item.addEventListener('click', closeModal))

getElement('.pizzaInfo--qtmenos').addEventListener('click', () => {
  modalQtd > 1 ? modalQtd-- : ''
  getElement('.pizzaInfo--qt').innerHTML = modalQtd;
})

getElement('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQtd++; 
  getElement('.pizzaInfo--qt').innerHTML = modalQtd;
});

getElements('.pizzaInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', (event) => {
    getElement('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  })
})

getElement('.pizzaInfo--addButton').addEventListener('click', () => {
  let size = parseInt(getElement('.pizzaInfo--size.selected').getAttribute('data-key'));

  let identifier = pizzaJson[modalKey].id + '@' + size;

  let key = cart.findIndex(item => item.identifier == identifier);

  key > -1
  ? cart[key].qtd += modalQtd
  : cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qtd: modalQtd
    }) 
  
  updateCart();
  closeModal();
})

getElement('.menu-openner').addEventListener('click', () => 
  cart.length > 0 ? getElement('aside').style.left = '0' : ''
)

getElement('.menu-closer').addEventListener('click', () => getElement('aside').style.left = '100vw')

updateCart = () => {
  getElement('.menu-openner span').innerHTML = cart.length;

  if(cart.length > 0) {
    getElement('aside').classList.add('show')
    getElement('.cart').innerHTML = '';

    let subTotal = 0;
    let descount = 0;
    let total = 0;

    for(let i in cart) {
      let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);
      subTotal += pizzaItem.price * cart[i].qtd;

      let cartItem = getElement('.models .cart--item').cloneNode(true);
      
      let pizzaSizeName

      switch(cart[i].size) {
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      }

      let pizzaName =`${pizzaItem.name} (${pizzaSizeName})`;
      
      cartItem.querySelector('img').src = '/assets/' + pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
      
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        cart[i].qtd > 1 ? cart[i].qtd-- : cart.splice(i, 1);
        updateCart();
      })

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qtd++;
        updateCart();
      });

      getElement('.cart').append(cartItem);
    }

    descount = subTotal * 0.1;
    total = subTotal - descount;

    getElement('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
    getElement('.desconto span:last-child').innerHTML = `R$ ${descount.toFixed(2)}`;
    getElement('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

  } else {
      getElement('aside').classList.remove('show');
      getElement('aside').style.left = '100vw';
  }
}