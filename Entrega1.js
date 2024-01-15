const readlineSync = require('readline-sync') //módulo para interação

class Usuario {
    isLogged = false;
    historico = []; // <== TO DO:: fazer operações
    // representa o usuário, suas informações e seu histórico de reservas.
    constructor(nome, endereco, username, password){
        usuarios_id = usuarios_id+1;

        this.id = usuarios_id;
        this.nome = nome
        this.endereco = endereco 
        this.username = username 
        this.password = password   
    }
    setLogged(logado){
        this.isLogged=logado;
    }
    verDados(){
        mensagem = 'É preciso realizar o login para acessar seus dados.';
        //Para ver os dados, o usuário precisa ter feito login.
        if (this.isLogged){
            mensagem = 'Seus dados:\nNome: ${this.nome}\nEndereço: ${this.endereco}\nId: ${this.id}\n';
        } 
        return mensagem;
    }

    modificarDados(nome, endereco, username, password){
        mensagem = 'É preciso realizar o login para modificar seus dados.';
        if (this.isLogged){
            this.nome = nome
            this.endereco = endereco 
            this.username = username 
            this.password = password   
            mensagem = 'Dados modificados com sucesso!';
        }
        return mensagem;
    }

}

class Propriedade { 
    // representa as informações da propriedade.
    constructor(nome, endereco, capacidadeHospedes, numQuartos, precoNoite){
        propriedades_id = propriedades_id+1;

        this.id = propriedades_id
        this.nome = nome
        this.endereco = endereco
        this.capacidadeHospedes = capacidadeHospedes //capacidade total de hóspede seria a capacidade total da pousada e não de cada quarto, considerando que todos os quartos são iguais e comportam a mesma quantidade de hóspedes.
        this.numQuartos = numQuartos
        this.precoNoite = precoNoite
        this.disponibilidade = numQuartos  // disponibilidade = num de quartos - reservas. A disponibilidade inicial é igual ao número de quartos, já que não tem reservas.
    }

    increaseDisponibilidade(){
        this.disponibilidade++
    }

    decreaseDisponibilidade(){
        this.disponibilidade--
    }

    getDisponibilidade(){
        return this.disponibilidade;
    }
     /*
    Eu escolhi definir a capacidade de hóspedes como a capacidade total da pousada, considerando que todos os quartos são iguais e comportam a mesma quantidade de hóspedes, 
    uma vez que se a capacidade de hóspede fosse a capacidade por quarto, a variável 'capacidadeHospede' seria um atributo de uma nova classe 'Quartos', além disso, 
    teria que se considerar que os quartos seriam diferentes, comportando uma quantidade diferente de hóspedes, variando o preço por noite.
    */
}    

class Reserva {
    // representa as informações das reservas feitas.
    constructor(id, idPropriedade, idUsuario, dataCheckin, dataCheckout, valor, statusPagamento){ 
        this.id = id
        this.idPropiedade = idPropriedade
        this.idUsuario = idUsuario
        this.dataCheckin = dataCheckin
        this.dataCheckout = dataCheckout
        this.valor = valor
        this.statusPagamento = statusPagamento; // 'Pago' || 'Pendente'
    }
}

class Anuncio {
    // representa um anúncio de uma propriedade e armazena informações importantes ao anunciar uma propriedade.
    constructor(id, idProprietario, idPropriedade, titulo, descricao, status){
        this.id = id
        this.idPropietario = idPropietario
        this.idPropriedade = idPropriedade
        this.titulo = titulo
        this.descricao = descricao
        this.status = status; // 'Publicado' || 'Não Publicado'
    }
}

class Sistema {    // Representa o sistema que gerencia a pousada.
    // Decidi não colocar o usuário como atributo da classe Sistema, porque só terá um usuário logado por vez.
    propriedades = []; //array de objetos
    reservas = [];
    anuncios = [];

    constructor(){ }    //constructor fica vazio, porque terão funções específicas para gerenciar cada um dos atribubtos. 

    //Propriedades:
    addPropriedade(prop){  //Função adiciona uma propriedade na lista de propriedades da classe Sistema.
        this.propriedades.push(prop);
    }

    listarPropriedades(){ 
        return this.propriedades.sort((a, b) => a.nome.localeCompare(b.nome)); //ordena o array em função de itens do array
       
    }
    
    delPropriedade(idPropriedadeApagar){
        this.propriedades = this.propriedades.filter(prop => prop.id !== idPropriedadeApagar);

        // TO DO (Verificar condições abaixo)
        //Só permite a exclusão caso não haja reservas para a propriedade selecionada. 
        //Além disso, anúncios envolvendo essa propriedade também devem ser excluídos.
    }



    listarReservas(){ 
        //ordem cronológica 
    }

    listarAnuncios(){
        //ordem alfabética
    }

    CancelarReserva(){
        //exige 24h de antecedência
    }

   
}

let usuarios_id = 0;
let usuarios_sistema = [
    new Usuario("Giulia", "Rua A", "giu", "1")
];
let usuarioLogado; 
let sistema;
let propriedades_id = 0;

function logout() {
    usuarioLogado.setLogged(false);
    menuInicial();
}

function login() {
// Função pede nome e senha para realizar login
    console.log("Faça seu login!\n");
    const username = readlineSync.question('Digite seu username: ');
    const password = readlineSync.question('Digite sua senha: ');
    /*
    Para o login acontecer, o username do usuário e a senha precisam ser compatíveis. 
    É feito um loop que percorre os usuários do sistema e confere se existe o usuário que está efetuando o login.
    */
    let usuarioEncontrado = null;
    for (const user of usuarios_sistema) {
            if (user.username === username && user.password === password) { 
                usuarioEncontrado = user;
                break;  //Interrompe o loop quando um usuário for encontrado
        }
    }

    if (usuarioEncontrado) {
        usuarioLogado = usuarioEncontrado;
        usuarioLogado.setLogged(true);
        console.clear();
        console.log('Login realizado com sucesso!\nBem-vindo(a) '+usuarioLogado.nome);
        sistema = new Sistema(); //objeto da classe Sistema
        menuLogado(); //Após o login o funcionário é redirecionado para o menu inicial de funcionário logado

    } else {
        console.clear();
        console.log('Falha ao realizar o Login. Usuário não encontrado ou senha incorreta.\n\n');
        menuInicial();
    }
}

function cadastro_usuario(){  
    //para fazer cadastro, será usado os dados na classe usuário: nome, endereço e será gerado um id.
    console.log("Faça seu cadastro!\n");
    const nome = readlineSync.question('Digite seu nome: ')   
    const endereco = readlineSync.question('Digite seu endereço: ')
    const username = readlineSync.question('Digite seu username: ')
    const password = readlineSync.question('Digite uma senha:')
    usuarios_sistema.push(new Usuario(nome, endereco, username, password)); //Após colocar suas informações, é adicionado um novo usuário no array de usuários do sistema.

    console.clear();
    console.log('Cadastro realizado com sucesso!')
    menuInicial(); //Após o cadastro o funcionário é redirecionado para o menu inicial, caso ele queira cadastrar mais pessoas, sair do programa ou fazer login.
}

function sair(){
    process.exit(0);
}

function menuInicial(){ //Menu inicial dá opções ao usuário não logado ao abrir o sistema.
    console.log("Escolha uma das opções de entrada abaixo:\n\n");
    console.log("1. Login");
    console.log("2. Cadastro");
    console.log("3. Sair");
    const opcao = readlineSync.question('\n >> ');
    console.clear();
    switch (opcao) {
        case "1":
            login();
            break;
        case "2":
            cadastro_usuario();
            break;
        case "3":
            sair();
            break;
        default:
            console.log("Opção inválida.");
            sair();
            break;
    }
}

// USUÁRIO LOGADO
function menuLogado(){ //Menu inicial para os que já estão logados, dá opções ao usuário ao efetuar login.
    const opcao = '0';
    while (opcao != '100'){
        console.clear();
        console.log("Escolha uma das opções de entrada abaixo:\n\n");
        console.log("1. Ver Meus Dados");
        console.log("2. Modificar Meus Dados");
        console.log("3. Ver Lista de Propriedades");
        console.log("4. Ver Lista de Reservas");
        console.log("5. Ver Lista de Anúncios");
        console.log("6. Reservar Propriedade");
        console.log("7. Cancelar Reserva");
        console.log("8. Adicionar Propriedade");
        console.log("9. Excluir Propriedade");
        console.log("10. Fazer Anúncio");
        console.log("11. Excluir Anúncio");
        console.log("12. Avaliar Estadia");
        console.log("13. Visualizar Avaliações");// = Visualizar as RESERVAS que já possue avaliações. As avaliações serão um atributo da classe Reserva.
        console.log("100. Logout");
        
        const opcao = readlineSync.question('\n >> ');
        console.clear();
        switch (opcao) {
            case "1":
                mensagem = usuarioLogado.verDados();
                console.log(mensagem);
                break;

            case "2":
                const novoNome = readlineSync.question('Digite seu novo nome: ')
                const novoEndereco = readlineSync.question('Digite seu novo endereço: ')
                const novoUsername = readlineSync.question('Digite seu novo username: ')
                const novaPassword = readlineSync.question('Digite sua nova senha: ')
                mensagem = usuarioLogado.modificarDados(novoNome, novoEndereco, novoUsername, novaPassword)
                console.log(mensagem)
                break;

            case "3":
                propriedadesOrdenadas = sistema.listarPropriedades(); // propriedadesOrdenadas é um array das propriedades ordenadas 
                console.log('Essas são as propriedades disponíveis: ')
                console.table(propriedadesOrdenadas); 
                readlineSync.question('Pressione ENTER para continuar');  
                break;

            case "8": //8. Adicionar Propriedade
                const novoNomeProp = readlineSync.question('Digite o nome da nova propriedade: ')
                const novoEnderecoProp = readlineSync.question('Digite o endereço da nova propriedade: ')
                const novaCapacidadeHospedes = readlineSync.question('Digite a capacidade de hóspedes da nova propriedades: ')
                const novoNumQuartos = readlineSync.question('Digite a quatidade de quartos da nova propriedade: ')
                const novoPrecoNoite = readlineSync.question('Digite o preço por noite da nova propriedade: ')
                propriedade = new Propriedade(novoNomeProp, novoEnderecoProp, novaCapacidadeHospedes,novoNumQuartos,novoPrecoNoite);
                sistema.addPropriedade(propriedade);
                break;

            case "9": //9. Excluir Propriedade
                const idPropriedadeApagar = readlineSync.question('Digite o id da propriedade que deseja excluir: ') // Sempre lê string
                sistema.delPropriedade( parseInt(idPropriedadeApagar) ); // parseInt converte string para inteiro.
                break;






            case "100":
                logout();
                break;
            default:
                console.log("Opção inválida.");
                sair();
                break;
        }
    }
}


// Aqui começa a rodar o programa. Limpa o console e chama o menu inicial.
console.clear();
menuInicial();