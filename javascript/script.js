// ----------------------------------------------------------Funções do slide (inicio da pagína)--------------------------------------------------------------------------------------------------//

let counter = 1;
const totalSlides = 4;

function autoSlide() {
    // Altera o estado do rádio para o slide atual
    document.getElementById(`radio${counter}`).checked = true;
    
    // Remove a classe 'active' de todos os botões automáticos
    const autoBtns = document.querySelectorAll('.navigation-auto .auto-btn');
    autoBtns.forEach(btn => btn.classList.remove('active'));

    // Adiciona a classe 'active' ao botão correspondente ao slide atual
    const activeBtn = document.querySelector(`.auto-btn${counter}`);
    activeBtn.classList.add('active');

    // Incrementa o contador e reseta se necessário
    counter++;
    if (counter > totalSlides) {
        counter = 1;
    }
}

// Configura o intervalo para 4 segundos para trocar os slides automaticamente
setInterval(autoSlide, 4000);

//-------------------------------------------------------O Script para os eventos que acontecem no Carrinho-------------------------------------------------------------------------------------//

let quantidadeProduto = 1;
let complementosSelecionados = [];  // Agora vamos armazenar os complementos de forma separada
let precoProdutoBase = 0;
let precoFinal = 0;
let produtoSelecionado = {};
let cart = [];  // Carrinho de compras

// Referências dos elementos DOM
const quantityElement = document.getElementById('quantity');
const totalElement = document.getElementById('total');
const plusButton = document.getElementById('plus');
const lessButton = document.getElementById('less');
const finalizarCompraButton = document.getElementById('finalizarCompra');
const complementoButtons = document.querySelectorAll('.buttom-adicionar-complemento');

// Ajuste na função calcularPrecoTotal
function calcularPrecoTotal() {
    const precoComplementos = complementosSelecionados.reduce((total, complemento) => {
        const botao = document.querySelector(`[data-name="${complemento}"]`);
        return total + parseFloat(botao.getAttribute('data-preco'));
    }, 0);
    
    precoFinal = (precoProdutoBase + precoComplementos) * quantidadeProduto;
    totalElement.textContent = `Total: R$ ${precoFinal.toFixed(2)}`;
}

// Função para abrir o produto e ajustar o preço
function openProduct(element) {
    produtoSelecionado = {
        name: element.getAttribute("data-name"),
        price: parseFloat(element.getAttribute("data-price")),
        weight: element.getAttribute("data-weight"),
        image: element.getAttribute("data-image")
    };

    precoProdutoBase = produtoSelecionado.price;

    // Atualiza o conteúdo da seção produto-aberto
    document.querySelector(".produto-aberto .conteudo-produto h1").innerText = produtoSelecionado.name;
    document.querySelector(".produto-aberto .preços-subtitle").innerHTML = `<span><s>R$ 9,99</s></span> R$ ${produtoSelecionado.price} <span id="produto_gramas">${produtoSelecionado.weight}</span>`;
    document.querySelector(".produto-aberto .img-produto-conteiner img").src = produtoSelecionado.image;

    // Exibe a seção produto-aberto
    document.querySelector(".produto-aberto").style.display = "flex";

    // Atualiza o total
    calcularPrecoTotal();
}

plusButton.addEventListener('click', () => {
    quantidadeProduto++;
    quantityElement.textContent = quantidadeProduto; // Atualiza o display da quantidade
    calcularPrecoTotal(); // Recalcula o total
});

lessButton.addEventListener('click', () => {
    if (quantidadeProduto > 1) {
        quantidadeProduto--;
        quantityElement.textContent = quantidadeProduto; // Atualiza o display da quantidade
        calcularPrecoTotal(); // Recalcula o total
    }
});

// Função para adicionar produtos ao carrinho
function addToCart(product) {
    // Cria uma descrição única para o produto com os complementos
    const complementoNome = complementosSelecionados.join(" + ");
    const uniqueIdentifier = `${product.name} ${complementoNome ? "+ " + complementoNome : ""}`;

    // Verifica se o item já existe no carrinho
    const existingItemIndex = cart.findIndex(
        item => item.uniqueIdentifier === uniqueIdentifier
    );

    if (existingItemIndex !== -1) {
        // Se o item já existir, apenas incrementa a quantidade
        cart[existingItemIndex].quantity += product.quantity;
    } else {
        // Se o item não existir, adiciona como um novo item
        const productWithIdentifier = {
            ...product,
            complementos: [...complementosSelecionados], // Garante que a lista de complementos seja copiada
            uniqueIdentifier: uniqueIdentifier
        };

        cart.push(productWithIdentifier);
    }

    // Atualiza o contador de itens no carrinho e exibe os itens
    updateCartCount();
    displayCartItems();
}

// Função para atualizar o contador de itens no carrinho
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    
    // Calcula o total de itens no carrinho
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Atualiza o contador com o total
    cartCountElement.textContent = totalItems;
}

// Função para exibir os itens no carrinho
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Limpa os itens do carrinho

    // Calcula o total de produtos e o valor total do carrinho
    let totalCarrinho = 0;
    let totalQuantidade = 0;

    if (cart.length === 0) {
        // Exibe uma mensagem caso o carrinho esteja vazio
        cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        const complementoText = item.complementos.length > 0 ? `+ ${item.complementos.join(', ')}` : ''; // Exibe os complementos, se houver

        // Calcula o preço total do produto + complementos
        const precoTotalProdutoComComplementos = item.price + item.complementos.reduce((total, complemento) => {
            // Pega o preço de cada complemento do data-preco
            const precoComplemento = parseFloat(document.querySelector(`[data-name="${complemento}"]`).getAttribute('data-preco'));
            return total + precoComplemento; // Soma o preço do complemento
        }, 0);
        
        const precoTotal = precoTotalProdutoComComplementos * item.quantity; // Preço total considerando a quantidade do produto
        totalCarrinho += precoTotal; // Acumula o valor total do carrinho
        totalQuantidade += item.quantity; // Acumula o número de produtos no carrinho

        cartItem.innerHTML = `
            <div class="cart-item-content">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <p><strong>${item.name}</strong>${complementoText}</p>
                    <p>Preço total: R$ ${precoTotal.toFixed(2)}</p>
                    <!-- Exibe a quantidade de cada item abaixo do preço -->
                    <p class="item-quantidade">Quantidade: ${item.quantity}</p> 
                </div>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Atualiza o total do carrinho
    const cartTotal = document.getElementById('cart-total');
    cartTotal.textContent = totalCarrinho.toFixed(2); // Total do carrinho

    // Atualiza a quantidade total de produtos
    const cartQuantidade = document.getElementById('cart-quantidade');
    cartQuantidade.textContent = `total de itens: ${totalQuantidade}`; // Exibe a quantidade total de produtos no carrinho
}

// Captura os dados do produto e adiciona ao carrinho
finalizarCompraButton.addEventListener('click', function (event) {
    event.preventDefault(); // Previne o comportamento padrão

    const product = {
        name: produtoSelecionado.name,
        price: precoProdutoBase,
        weight: produtoSelecionado.weight,
        image: produtoSelecionado.image,
        quantity: quantidadeProduto // Usa o contador atual do produto
    };

    addToCart(product); // Adiciona o produto ao carrinho
    alert(`Produto ${product.name} adicionado ao carrinho!`);
});

// Exibir ou ocultar o carrinho ao clicar no ícone
document.getElementById('cart-icon').addEventListener('click', () => {
    const cartSection = document.getElementById('cart');
    cartSection.style.display = cartSection.style.display === 'none' || cartSection.style.display === '' ? 'block' : 'none';
});

// Fechar o carrinho ao clicar no botão de fechar
document.getElementById('close-cart').addEventListener('click', () => {
    const cartSection = document.getElementById('cart');
    cartSection.style.display = 'none';
});

// Função para adicionar ou remover complementos
complementoButtons.forEach(button => {
    button.addEventListener('click', function () {
        const icon = this.querySelector('i');
        const complementoNome = this.getAttribute('data-name');  // Pega o nome do complemento dinamicamente
        const precoComplemento = parseFloat(this.getAttribute('data-preco'));

        if (icon.classList.contains('fa-plus')) {
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
            complementosSelecionados.push(complementoNome); // Adiciona complemento
        } else {
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
            complementosSelecionados = complementosSelecionados.filter(item => item !== complementoNome); // Remove complemento
        }

        calcularPrecoTotal();
    });
});

// Função para limpar o carrinho
function clearCart() {
    // Limpa o array do carrinho
    cart = [];
    // Remove todos os itens exibidos no carrinho
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    // Atualiza os valores do total e quantidade do carrinho
    const cartTotal = document.getElementById('cart-total');
    cartTotal.textContent = '0.00';

    const cartQuantidade = document.getElementById('cart-quantidade');
    cartQuantidade.textContent = '0';

    // Atualiza o contador de itens do carrinho
    updateCartCount();
}

// Adiciona o evento de clique ao botão de limpar
document.getElementById('clear-cart').addEventListener('click', clearCart);


// Função para abrir o produto
function openProduct(element) {
    produtoSelecionado = {
        name: element.getAttribute("data-name"),
        price: parseFloat(element.getAttribute("data-price")),
        weight: element.getAttribute("data-weight"),
        image: element.getAttribute("data-image"),
    };

    precoProdutoBase = produtoSelecionado.price;

    // Atualiza os detalhes do produto aberto
    document.querySelector(".produto-aberto .conteudo-produto h1").innerText = produtoSelecionado.name;
    document.querySelector(".produto-aberto .preços-subtitle").innerHTML = `<span><s>R$ 9,99</s></span> R$ ${produtoSelecionado.price} 
    <span id="produto_gramas">${produtoSelecionado.weight}</span>`;
    document.querySelector(".produto-aberto .img-produto-conteiner img").src = produtoSelecionado.image;

    // Oculta o cardápio de compras e exibe apenas a seção do produto aberto
    document.querySelector(".nav-icones-compras").classList.add("hidden");
    document.querySelector(".cardapio-compras").classList.add("hidden");
    document.querySelector(".produto-aberto").style.display = "flex";

    // Atualiza o total e o preço dos complementos
    calcularPrecoTotal();
    atualizarPrecoComplementos();
}

// Fechar o produto aberto e voltar ao cardápio
document.getElementById("close-expanded").addEventListener("click", () => {
    if (document.querySelector(".produto-aberto").style.display === "flex") {
        // Oculta a seção de produto aberto
        document.querySelector(".produto-aberto").style.display = "none";

        // Exibe a seção de cardápio de compras
        document.querySelector(".cardapio-compras").classList.remove("hidden");
    }
});

 //---------------------------------------------------------------------------------- Variáveis para controle da fidelidade----------------------------------------------------------------------//
 let quantidadeDeCompras = 0;
 const quantidadeMaxima = 10;

 const barra = document.getElementById('barra');
 const quantidadeElement = document.getElementById('quantidade');
 const resgatarButton = document.getElementById('resgatar');

 // Função para atualizar a barra de fidelidade
 function atualizarBarra() {
     // Atualizando a contagem de compras
     quantidadeElement.textContent = quantidadeDeCompras;

     // Calculando o preenchimento da barra de progresso (0 a 100)
     let progresso = (quantidadeDeCompras / quantidadeMaxima) * 100;
     barra.style.width = `${progresso}%`;

     // Verificando se a barra está cheia para habilitar o resgate
     if (quantidadeDeCompras >= quantidadeMaxima) {
         resgatarButton.disabled = false; // Habilita o botão de resgatar
     } else {
         resgatarButton.disabled = true; // Desabilita o botão de resgatar
     }
}

 // Função para adicionar um item ao carrinho e aumentar a fidelidade
 function adicionarCompra(quantidade) {
     if (quantidadeDeCompras + quantidade <= quantidadeMaxima) {
         quantidadeDeCompras += quantidade;
         atualizarBarra(); // Atualiza a barra após cada compra
     }
}

 // Simulando o botão de adicionar ao carrinho
 document.getElementById('finalizarCompra').addEventListener('click', () => {
     let quantidadeProduto = parseInt(document.getElementById('quantity').textContent);
     adicionarCompra(quantidadeProduto);
 });

 resgatarButton.addEventListener('click', () => {
    if (quantidadeDeCompras >= quantidadeMaxima) {
        alert("Parabéns! Você resgatou o prêmio!");
    } else {
        alert("Ainda não atingiu o limite necessário para resgatar o prêmio.");
    }
});
  // Chamada inicial para atualizar a barra no carregamento
  atualizarBarra();


// ---------------------------------------------------------------Função para ocultar todas as seção e seus eventos ------------------------------------------------------------------------------//
// Função para esconder todas as seções
function hideSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
}

// Função para exibir as seções correspondentes ao botão clicado
function showSectionsForButton(buttonClass) {
    hideSections();
          
    // Exibir as seções com base no botão clicado
    switch(buttonClass) {
        case 'home-btn':
            document.querySelector('.home').classList.add('active');
            document.querySelector('.menu').classList.add('active');
            document.querySelector('.testimonials').classList.add('active');
            document.querySelector('.img-onda').classList.add('active'); // A imagem de onda sempre visível quando home for ativa
            break;
        case 'perfil-btn-lista':
            document.querySelector('.perfil_da_loja').classList.add('active');
            break;
        case 'compras-btn':
            document.querySelector('.compras').classList.add('active');
            document.querySelector('.produto-expandido').classList.add('active');
            break;
        case 'beneficios-btn':
            document.querySelector('.beneficios').classList.add('active');
            break;
        case 'login-btn':
            document.querySelector('.login').classList.add('active');
            break;
    }

    // Verificar se a seção "home" está ativa para aplicar a animação
    if (buttonClass === 'home-btn') {
        applyScrollReveal(); // Aplicar a animação ScrollReveal
    }
 
}

// Função para aplicar o ScrollReveal na classe '.feedback'
function applyScrollReveal() {
    ScrollReveal().reveal('.contexto', {
        origin: 'left',
        duration: 2000,
        distance: '80%',
        delay: 200,  // Ajuste de delay, você pode personalizar
    });
    ScrollReveal().reveal('.slider', {
        origin: 'right',
        duration: 2000,
        distance: '50%',
        delay: 200,  // Ajuste de delay, você pode personalizar
    });
    ScrollReveal().reveal('.feedback', {
        origin: 'right',
        duration: 2000,
        distance: '50%',
        
    });
    ScrollReveal().reveal('#testimonials_chef', {
        origin: 'right',
        duration: 2000,
        distance: '50%',
        delay: 200,  // Ajuste de delay, você pode personalizar
    });
    ScrollReveal().reveal('.dish', {
        origin: 'top',
        duration: 2000,
        distance: '30%',
        delay: 200,  // Ajuste de delay, você pode personalizar
    });
    ScrollReveal().reveal('.section-title', {
        origin: 'top',
        duration: 2000,
        distance: '50%',
        delay: 200,  // Ajuste de delay, você pode personalizar
    });
    ScrollReveal().reveal('.section-subtitle', {
        origin: 'top',
        duration: 2000,
        distance: '55%',
        delay: 200,  // Ajuste de delay, você pode personalizar
    });


}


// Eventos de clique para os botões
document.querySelector('.home-btn').addEventListener('click', () => showSectionsForButton('home-btn'));
document.querySelector('.compras-btn').addEventListener('click', () => showSectionsForButton('compras-btn'));
document.querySelector('.beneficios-btn').addEventListener('click', () => showSectionsForButton('beneficios-btn'));
document.querySelector('.login-btn').addEventListener('click', () => showSectionsForButton('login-btn'));


document.querySelector('.home-btn-lista').addEventListener('click', () => showSectionsForButton('home-btn'));
document.querySelector('.perfil-btn-lista').addEventListener('click', () => showSectionsForButton('perfil-btn-lista'));
document.querySelector('.beneficio-btn-lista').addEventListener('click', () => showSectionsForButton('beneficios-btn'));
document.querySelector('.produtos-btn-lista').addEventListener('click', () => showSectionsForButton('compras-btn'));

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//--------------------------------------------------------O script de abrir o icone Bars e os respectivos eventos dentro dele-----------------------------------------------//


document.getElementById('open_btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open-sidebar');
});
 // Selecionando elementos
 const menuIcon = document.getElementById('menu_icon');
 const sidebar = document.getElementById('sidebar');
 const closeIcon = document.getElementById('close_icon');
 const closeText = document.getElementById('close_text');

 // Função para abrir a sidebar ao clicar no ícone de menu
 menuIcon.addEventListener('click', () => {
     sidebar.classList.add('open'); // Abre a sidebar
     menuIcon.classList.add('hidden'); // Esconde o ícone de menu (fa-bars)
 });

 // Função para fechar a sidebar ao clicar no ícone de fechar (X) ou "Fechar"
 closeIcon.addEventListener('click', () => {
     sidebar.classList.remove('open'); // Fecha a sidebar
     menuIcon.classList.remove('hidden'); // Exibe novamente o ícone de menu (fa-bars)
 });
 closeText.addEventListener('click', () => {
     sidebar.classList.remove('open'); // Fecha a sidebar
     menuIcon.classList.remove('hidden'); // Exibe novamente o ícone de menu (fa-bars)
 });


// Selecionar o botão feed-btn-lista
// Selecionar o botão feed-btn-lista
const feedBtn = document.querySelector('.feed-btn-lista');

// Adicionar evento de clique ao botão
feedBtn.addEventListener('click', () => {
    // Garantir que a seção 'home' e suas sub-seções estejam ativas
    hideSections(); // Oculta todas as seções
    document.querySelector('.home').classList.add('active');
    document.querySelector('.menu').classList.add('active');
    document.querySelector('.testimonials').classList.add('active');
    document.querySelector('.img-onda').classList.add('active');
    
    // Rolar suavemente até a seção testimonials
    const testimonialsSection = document.querySelector('.testimonials');
    testimonialsSection.scrollIntoView({
        behavior: 'smooth', // Rolagem suave
        block: 'start',     // Alinhar a seção ao topo da visualização
    });
});
