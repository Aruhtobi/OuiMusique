$(window).ready(function () {
    $('#start').show()
    var connexion = $("#Connexion")
    var inscription = $('#Inscription')
    var MyJson
    if (!localStorage.getItem('Utilisateurs')) {
        MyJson =
            {
                users: []
            }
    } else {
        MyJson = JSON.parse(localStorage.getItem("Utilisateurs"))
    }
    function saveJSON() {
        localStorage.setItem('Utilisateurs', JSON.stringify(MyJson))
    }
    //----------------------------------------------------------------------------------------------------------------//

    $('#bConnexion').click(function (a) {
        connexion.toggle()
    })
    $('#bInscription').click(function () {
        inscription.toggle()
    })
    $('#GotoIns').click(function (event) {
        event.preventDefault()
        connexion.hide()
        inscription.show()
    })
    $('#GotoCon').click(function (event) {
        event.preventDefault()
        inscription.hide()
        connexion.show()
    })
    $('#Inscription').submit(register)
    $('#Connexion').submit(login)
    //---------------------------------------------------------//
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    //-----------------------------------------------------------------------------------------//
    function register(event){
        event.preventDefault()
        // Etape a : Recupération des champs
        var pseudo = $('#newpseudo').val()
        var mail = $('#newmail').val()
        var mdp = $('#newpassword').val()
        var verifmdp = $('#verifpassword').val()
        // Etape B : Vérification des champs
        if (pseudo == "" || mail == "" || mdp == "" || verifmdp == "") {
            alert("Remplis les champs")
        } else if (!okmdp($('#newpassword').val())) {
            //Mdp contenant 1 chiffres 1 caractère spécial et min 6 caractère
            alert('Mots de passe incorrect. Le mots de passe doit être composé de 6 caractères minimum et doit contenir au moins 1 chiffre et 1 caractère spécial')
        } else {
            //Verification 2
            //Le pseudo ou L'email existent-ils déjà dans notre [] d'utilisateurs ?
            let pseudoExist = false
            let x
            for (x in MyJson.users) {
                let actualUser = MyJson.users[x]
                if (actualUser.pseudo == pseudo) {
                    pseudoExist = true
                    break;
                }
            }
            let mailExist = false
            let y
            for (y in MyJson.users) {
                let actualUser = MyJson.users[y]
                if (actualUser.mail == mail) {
                    mailExist = true
                    break;
                }
            }

            if (pseudoExist || mailExist) {
                alert("Pseudo ou Mail déjà éxistant")
            } else {
                // Etape C : Création de l'objet Utilisateur
                var user = {
                    id: uuidv4(),
                    pseudo: pseudo,
                    mail: mail,
                    mdp: mdp,
                }
                //Etape D : Ajout du nouvel utilisateur dans la liste des utilisateurs
                MyJson.users.push(user);
                //Etape e : Save in LocalStorage
                saveJSON()
                //Vider les champs
                $('#newpseudo').val("")
                $('#newmail').val("")
                $('#newpassword').val("")
                $('#verifpassword').val("")
                //Login
                displayLogin()

            }
        }
    }
    function login(event) {
        event.preventDefault()
        //Etape a : Récupération des champs
        var pseudo = $('#mailpseudo').val()
        var mail = $('#mailpseudo').val()
        var password = $('#mdp').val()
        //Etape b : Vérification
        //Les champs sont-ils remplis ?
        if (password == "" || pseudo == "") {
            alert("Champs non remplis")
        } else {
            //Le pseudo existe ? Si oui le mdp correspond-il ?
            let isConnected = false
            let x
            for (x in MyJson.users) {
                var actualUser = MyJson.users[x]
                if (actualUser.pseudo == pseudo || actualUser.mail == mail ) {
                    if (actualUser.mdp == password) {
                        isConnected = true
                        sessionStorage.setItem("session", JSON.stringify(actualUser))
                        break;
                    }
                }
            }
            if (isConnected) {
                alert("Bienvenue sur Spatifie")
                $('#start').hide()
                $('#Connexion').hide()
                $('#walldiv').show()
            } else {
                alert('Connexion échouer !')
            }
        }
    }
    function displayRegister(){
        $('#Inscription').show()
        $('#Connexion').hide()
    }
    function displayLogin(){
        $('#Connexion').show()
        $('#Inscription').hide()
    }
    function okmdp(mdp){
        var regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/
        return regex.test(mdp)
    }
})