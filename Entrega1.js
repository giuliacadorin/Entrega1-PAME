const readlineSync = require('readline-sync') //módulo para interação com o usuário pelo teclado

let usuarios_id = 0;
let propriedades_id = 0;
let reservas_id = 0;
let anuncios_id = 0;

class Usuario {
    id = 0;
    isLogged = false;
    nome = "";
    endereco = "";
    historico = []; // <== TO DO:: fazer operações
    // representa o usuário, suas informações e seu histórico de reservas.
    constructor(nome, endereco, username, password) {
        usuarios_id = usuarios_id + 1;
        this.id = usuarios_id;
        this.nome = nome
        this.endereco = endereco
        this.username = username
        this.password = password
    }
    setLogged(logado) {
        this.isLogged = logado;
    }

    modificarDados(nome, endereco, username, password) {
        let mensagem = 'É preciso realizar o login para modificar seus dados.';
        if (this.isLogged) {
            this.nome = nome
            this.endereco = endereco
            this.username = username
            this.password = password
            mensagem = 'Dados modificados com sucesso!';
        }
        return mensagem;
    }

    addHistorico(idreserva) {
        this.historico.push(idreserva)
    }

}

class Propriedade {
    // representa as informações da propriedade.
    constructor(nome, endereco, capacidadeHospedes, numQuartos, precoNoite) {
        propriedades_id = propriedades_id + 1;

        this.id = propriedades_id
        this.nome = nome
        this.endereco = endereco
        this.capacidadeHospedes = capacidadeHospedes //capacidade total de hóspede seria a capacidade total da pousada e não de cada quarto, considerando que todos os quartos são iguais e comportam a mesma quantidade de hóspedes.
        this.numQuartos = numQuartos
        this.precoNoite = precoNoite
        this.disponibilidade = numQuartos  // disponibilidade = num de quartos - reservas. A disponibilidade inicial é igual ao número de quartos, já que não tem reservas.
    }

    increaseDisponibilidade() {
        this.disponibilidade++
    }

    decreaseDisponibilidade() {
        this.disponibilidade--
    }

    getDisponibilidade() {
        return this.disponibilidade;
    }
    /*
   Eu escolhi definir a capacidade de hóspedes como a capacidade total da pousada, considerando que todos os quartos são iguais e comportam a mesma quantidade de hóspedes, 
   uma vez que se a capacidade de hóspede fosse a capacidade por quarto, a variável 'capacidadeHospede' seria um atributo de uma nova classe 'Quartos', além disso, 
   teria que se considerar que os quartos seriam diferentes, comportando uma quantidade diferente de hóspedes, variando o preço por noite.
   */
}

class Reserva {
    id = 0;
    dataCheckin = "";
    dataCheckout = "";
    valor = 0;
    statusPagamento = "Indefinido";
    avaliacao = "";

    // representa as informações das reservas feitas.
    constructor(idPropriedade, idUsuario, dataCheckin, dataCheckout, valor, statusPagamento) {
        reservas_id = reservas_id + 1;

        this.id = reservas_id;
        this.idPropriedade = idPropriedade
        this.idUsuario = idUsuario
        this.dataCheckin = dataCheckin
        this.dataCheckout = dataCheckout
        this.valor = valor
        this.statusPagamento = statusPagamento; // 'Pago' || 'Pendente'
        this.avaliacao = "";
    }

    setAvaliacao(aval) {
        this.avaliacao = aval;
    }
}

class Anuncio {
    // representa um anúncio de uma propriedade e armazena informações importantes ao anunciar uma propriedade.
    constructor(idProprietario, idPropriedade, titulo, descricao, status) {
        // ID do proprietário é o ID do funcionário que cadastra o anúncio (ou seja, esse funcionário é o proprietário do anúncio)
        anuncios_id = anuncios_id + 1;

        this.id = anuncios_id;
        this.idProprietario = idProprietario
        this.idPropriedade = idPropriedade
        this.titulo = titulo
        this.descricao = descricao
        this.status = status; // 'Publicado' || 'Não Publicado'
    }
}

class Sistema {    // Representa o sistema que gerencia a pousada.
    // Decidi não colocar o usuário como atributo da classe Sistema, porque só terá um usuário logado por vez.
    propriedades = []; //array de objetos propriedade
    reservas = [];
    anuncios = [];

    constructor() { }    //constructor fica vazio, porque terão funções específicas para gerenciar cada um dos atribubtos. 

    // Função para calcular a diferença entre duas datas, para calcular a quantidade de diárias.
    calcularDiferencaDatas(dataInicio, dataFim) {
        // Converter as datas para objetos Date
        const [diaInicio, mesInicio, anoInicio] = dataInicio.split('/').map(Number);
        const [diaFim, mesFim, anoFim] = dataFim.split('/').map(Number);

        const dateInicio = new Date(anoInicio, mesInicio - 1, diaInicio); // mesInicio - 1 porque os meses em JavaScript são zero-based
        const dateFim = new Date(anoFim, mesFim - 1, diaFim);

        // Verificar se as datas são válidas
        if (isNaN(dateInicio) || isNaN(dateFim)) {
            console.error('Datas fornecidas são inválidas.');
            return NaN;
        }

        // Calcular a diferença em milissegundos
        const diferencaEmMilissegundos = Math.abs(dateFim - dateInicio);

        // Calcular a diferença em dias
        const diferencaEmDias = Math.ceil(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

        return diferencaEmDias;
    }

    //Propriedades:
    addPropriedade(prop) {  //Função adiciona uma propriedade na lista de propriedades da classe Sistema.
        this.propriedades.push(prop);
    }

    listarPropriedades() {
        return this.propriedades.sort((a, b) => a.nome.localeCompare(b.nome)); //ordena o array em função de itens do array em ordem alfabética
    }

    delPropriedade(idPropriedadeApagar) {
        let mensagem = "Não é possível excluir propriedade que possem reservas."
        if (sistema.countReservasPropriedade(idPropriedadeApagar) == 0) {
            this.propriedades = this.propriedades.filter(prop => prop.id !== idPropriedadeApagar);
            sistema.delAnuncios(idPropriedadeApagar);
            mensagem = "Propriedade excluída com sucesso!";
        }
        return mensagem;
        //Só permite a exclusão caso não haja reservas para a propriedade selecionada. 
        //Além disso, anúncios envolvendo essa propriedade também devem ser excluídos.
    }

    getPrecoNoite(idPropriedade) {
        const propNoite = this.propriedades.find(prop => prop.id === idPropriedade);
        return propNoite.precoNoite;
    }

    //Reservas:
    addReserva(res) {  //Função adiciona uma reserva na lista de reservas da classe Sistema.
        this.reservas.push(res);
        usuarioLogado.addHistorico(res)
    }
    listarReservas() {
        return this.reservas.sort((a, b) => a.dataReserva - b.dataReserva); //ordena o array em função de itens do array em ordem cronológica 
    }

    listarReservasPropriedade(idpropriedade) {
        return this.reservas.sort((a, b) => a.dataReserva - b.dataReserva); //ordena o array em função de itens do array em ordem cronológica 
    }

    delReserva(idReserva) {
        //exige 24h de antecedência
        const reservaApagar = this.reservas.filter(reser => reser.id === idReserva);
        const hoje = new Date();

        // Obtém o dia, mês e ano
        const dia = hoje.getDate().toString().padStart(2, '0'); // Garante dois dígitos, adicionando zero à esquerda, se necessário
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // Meses são zero-based, então adicionamos 1
        const ano = hoje.getFullYear();

        // Monta a data no formato brasileiro
        const hojeFormatado = `${dia}/${mes}/${ano}`;

        let mensagem = "\nNão foi possível cancelar a reserva. É necessário 24h de antecedência.\n";
        const antecedencia = sistema.calcularDiferencaDatas(reservaApagar[0].dataCheckin, hojeFormatado)
        if (antecedencia > 1) {
            this.reservas = this.reservas.filter(reser => reser.id !== idReserva);
            mensagem = "\nReserva cancelada com sucesso!\n"
        }
        return mensagem;
    }

    countReservasPropriedade(idPropriedade) {
        return this.reservas.filter(res => res.idPropriedade === idPropriedade).length // retorna a quantidade de reservas realizadas na propriedade.        
    }

    //Avaliações:
    setAvaliacao(idRes, aval) {
        const reservaSelecionada = this.reservas.find(res => res.id === idRes); //acha dentro do array reservas o objeto reserva que tem o id desejado.
        reservaSelecionada.setAvaliacao(aval)
    }

    listarAvaliacoes() {
        return this.reservas = this.reservas.filter(res => res.avaliacao !== "");
    }

    //Anúncios:
    addAnuncio(anun) { //Função adiciona um anúncio na lista de anúncios da classe Sistema.
        this.anuncios.push(anun);
    }

    listarAnuncios() {
        return this.anuncios.sort((a, b) => a.nome.localeCompare(b.nome)); //ordena o array em função de itens do array em ordem alfabética
    }

    delAnuncio(idAnuncio) { // Apaga anúncio da propriedade pelo id do anúncio.
        this.anuncios = this.anuncios.filter(anun => anun.id !== idAnuncio);
        return 'Anúncio excluído com sucesso.'
    }

    delAnuncios(idPropriedade) { // Apaga anúncios da propriedade pelo id da propriedade
        this.anuncios = this.anuncios.filter(anun => anun.idPropriedade !== idPropriedade);
    }
}

let usuarios_sistema = [];
let usuarioLogado;
let sistema;

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
        sistema = new Sistema(); //Instancia novo objeto da classe Sistema
        menuLogado(); //Após o login o funcionário é redirecionado para o menu inicial de funcionário logado

    } else {
        console.clear();
        console.log('Falha ao realizar o Login. Usuário não encontrado ou senha incorreta.\n\n');
        menuInicial();
    }
}

function cadastro_usuario() {
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

function sair() {
    process.exit(0);
}

function menuInicial() { //Menu inicial dá opções ao usuário não logado ao abrir o sistema.
    console.log("Escolha uma das opções de entrada abaixo:\n\n");
    console.log("1. Login");
    console.log("2. Cadastro");
    console.log("3. Sair");
    let opcao = readlineSync.question('\n >> ');
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
function menuLogado() { //Menu inicial para os que já estão logados, dá opções ao usuário ao efetuar login.
    const opcao = '0';
    while (opcao != '100') {
        console.clear();
        console.log('Bem-vindo(a) ' + usuarioLogado.nome);
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
        console.log("12. Avaliar Estadia"); //As avaliações serão um atributo da classe Reserva.
        console.log("13. Visualizar Avaliações"); // = Visualizar as RESERVAS que já possuem avaliações. 
        console.log("100. Logout");

        const opcao = readlineSync.question('\n >> ');
        console.clear();
        switch (opcao) {
            case "1": //1. Ver Meus Dados
                console.log("Seus dados:");
                console.log("Id: " + usuarioLogado.id);
                console.log("Nome: " + usuarioLogado.nome);
                console.log("Endereço: " + usuarioLogado.endereco);
                console.log("Username: " + usuarioLogado.username);

                console.log("Histórico de reservas: ");

                if (usuarioLogado.historico.length > 0) {
                    console.table(usuarioLogado.historico);
                } else {
                    console.log(" >> Usuário não possui reservas.");
                }
                readlineSync.question('Pressione ENTER para continuar');
                break;

            case "2":  //2. Modificar Meus Dados
                const novoNome = readlineSync.question('Digite seu novo nome: ')
                const novoEndereco = readlineSync.question('Digite seu novo endereço: ')
                const novoUsername = readlineSync.question('Digite seu novo username: ')
                const novaPassword = readlineSync.question('Digite sua nova senha: ')
                let mensagemModificaDados = usuarioLogado.modificarDados(novoNome, novoEndereco, novoUsername, novaPassword)
                console.log(mensagemModificaDados)
                readlineSync.question('Pressione ENTER para continuar');
                break;

            case "3":  //3. Ver Lista de Propriedades
                console.log('Essas são as propriedades disponíveis: ')
                let propriedadesOrdenadas = sistema.listarPropriedades(); // propriedadesOrdenadas é um array das propriedades ordenadas 
                if (propriedadesOrdenadas.length > 0) {
                    console.table(propriedadesOrdenadas);
                } else {
                    console.log(" >> Não existem propriedades cadastras.");
                }
                readlineSync.question('Pressione ENTER para continuar');
                break;

            case "4": //4. Ver Lista de Reservas
                let reservasOrdenadas = sistema.listarReservas(); // reservasOrdenadas é um array das propriedades ordenadas 
                console.log('Essas são as reservas feitas: ')
                if (reservasOrdenadas.length > 0) {
                    console.table(reservasOrdenadas);
                } else {
                    console.log(" >> Não existem reservas cadastras.");
                }
                readlineSync.question('Pressione ENTER para continuar');
                break;

            case "5": //5. Ver Lista de Anúncios
                let anunciosOrdenados = sistema.listarAnuncios(); // anunciosOrdenados é um array das propriedades ordenadas 
                console.log('Esses são os anúncios feitos: ')
                if (anunciosOrdenados.length > 0) {
                    console.table(anunciosOrdenados);
                } else {
                    console.log(" >> Não existem anúncios cadastros.");
                }
                readlineSync.question('Pressione ENTER para continuar');
                break;

            case "6": //6. Reservar Propriedade   
                const reservaidpropriedade = readlineSync.question('Digite o id da propriedade que deseja reservar: ')
                const reservaDataCheckin = readlineSync.question('Digite a data de Checkin: ')
                const reservaDataCheckout = readlineSync.question('Digite a data de Checkout: ')

                const reservaValorNoite = sistema.getPrecoNoite(parseInt(reservaidpropriedade))
                const diarias = sistema.calcularDiferencaDatas(reservaDataCheckin, reservaDataCheckout)
                const reservaValor = diarias * reservaValorNoite

                let statusPagamento = readlineSync.question('A reserva está?\n1. Paga\n2. Pendente\n>> ')
                if (statusPagamento == "1") statusPagamento = "Pago"
                else if (statusPagamento == "2") statusPagamento = "Pendente"
                else statusPagamento = "Indefinido"

                let reserva = new Reserva(parseInt(reservaidpropriedade), usuarioLogado.id, reservaDataCheckin, reservaDataCheckout, reservaValor, statusPagamento)
                sistema.addReserva(reserva);
                break;

            case "7": //7. Cancelar Reserva
                console.log("É necessário 24h de antecedência para cancelar uma reserva.")
                const idReservaApagar = readlineSync.question('Digite o id da reserva que deseja cancelar: ') // Sempre lê string
                let msg1 = sistema.delReserva(parseInt(idReservaApagar)); // parseInt converte string para inteiro.
                console.log(msg1);
                readlineSync.question('Pressione ENTER para continuar');
                break;


            case "8": //8. Adicionar Propriedade
                const novoNomeProp = readlineSync.question('Digite o nome da nova propriedade: ')
                const novoEnderecoProp = readlineSync.question('Digite o endereço da nova propriedade: ')
                const novaCapacidadeHospedes = readlineSync.question('Digite a capacidade de hóspedes da nova propriedades: ')
                const novoNumQuartos = readlineSync.question('Digite a quantidade de quartos da nova propriedade: ')
                const novoPrecoNoite = readlineSync.question('Digite o preço por noite da nova propriedade: ') //Considerando que o valor deve ser informado com os centavos separados por '.'
                let propriedade = new Propriedade(novoNomeProp, novoEnderecoProp, parseInt(novaCapacidadeHospedes), parseInt(novoNumQuartos), parseFloat(novoPrecoNoite));
                sistema.addPropriedade(propriedade);
                break;

            case "9": // 9. Excluir Propriedade
                const idPropriedadeApagar = readlineSync.question('Digite o id da propriedade que deseja excluir: ') // Sempre lê string
                const msg = sistema.delPropriedade(parseInt(idPropriedadeApagar)); // parseInt converte string para inteiro.
                console.log(msg);
                readlineSync.question('Pressione ENTER para continuar');
                break;

            case "10": // 10. Fazer Anúncio 
                const novoidPropriedade = readlineSync.question('Digite o id propriedade que deseja anunciar: ')
                const novoTituloProp = readlineSync.question('Digite o nome da título do anúncio: ')
                const novaDescricao = readlineSync.question('Escreva uma descrição para o anúncio: ')

                let statusAnuncio = readlineSync.question('O anúncio já está publicado?\n1. Sim\n2. Não\n>> ')
                if (statusAnuncio == "1") statusAnuncio = "Publicado."
                else if (statusAnuncio == "2") statusAnuncio = "Não publicado."
                else statusAnuncio = "Indefinido"

                let anuncio = new Anuncio(usuarioLogado.id, parseInt(novoidPropriedade), novoTituloProp, novaDescricao, statusAnuncio);
                sistema.addAnuncio(anuncio);
                break;

            case "11": //11. Excluir Anúncio
                const idAnuncioApagar = readlineSync.question('Digite o id do anúncio que deseja excluir: ') // Sempre lê string
                const message = sistema.delAnuncio(parseInt(idAnuncioApagar)); // parseInt converte string para inteiro.
                console.log(message);
                readlineSync.question('Pressione ENTER para continuar');
                break;

            case "12"://12. Avaliar Estadia   
                const idReservaAvaliar = readlineSync.question('Digite o id da reserva que deseja avaliar: ')
                const avaliacaoReserva = readlineSync.question('Digite a sua avaliação: ')
                sistema.setAvaliacao(parseInt(idReservaAvaliar), avaliacaoReserva)
                break;

            case "13": //13. Visualizar Avaliações
                let avaliacoes = sistema.listarAvaliacoes();
                console.log('Essas são as avaliações feitas: ')
                if (avaliacoes.length > 0) {
                    console.table(avaliacoes);
                } else {
                    console.log(" >> Não existem avaliações cadastras.");
                }
                readlineSync.question('Pressione ENTER para continuar');
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