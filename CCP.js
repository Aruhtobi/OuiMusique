$(window).ready(function () {
    localStorage.getItem('Utilisateurs')
    $('#start').show()
    var connexion = $("#Connexion")
    var inscription = $('#Inscription')
    if (!sessionStorage.getItem("session")) {
        $('#start').show()
    } else {
        principal()
    }
    var MyJson;
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

    var MusicGlobal
    if (!localStorage.getItem('MusicTableau')) {
        MusicGlobal = {
            "tableaux": []
        }
    } else {
        MusicGlobal = JSON.parse(localStorage.getItem('MusicTableau'))
        //On affiche ce qu'on a enregistré au dessus
        /*let x
        for (x in MusicGlobal.tableaux) {
            let ligne = MusicGlobal.tableaux[x]*/

            var urlPlaylist = "https://raw.githubusercontent.com/Aruhtobi/OuiMusique/master/jsonMusique.json"
            var urlTarget = urlPlaylist

            var somemusivs;

            $.get(urlTarget, function (response) {
                somemusivs = JSON.parse(response)
                var beachmusivs = somemusivs.songs;
                var o20 = beachmusivs.slice(0, 20);
                var o40 = beachmusivs.slice(20, 40);
                var n = 0;


                /* $('#name').text(musivs.songs[0].name)*/
                o20.forEach(function (data) {
                    var data1 = o20[n];
                    var data2 = o40[n];
                    n++;
                    $('#MusicTable').children('tbody').append(`
            <tr>
                <td><div><img src="${data1.image}"> <div style="width: 45%; float: right; text-align: center"><span>${data1.name} ${data1.artist}</span> </div></div><source src="${data1.song}" type="audio/mpeg"></td>
                <td><div><img src="${data2.image}"> <div style="width: 45%; float: right; text-align: center"><span>${data2.name} ${data2.artist}</span> </div></div><source src="${data2.song}" type="audio/mpeg"></td>
                
            </tr>
            `)
                })
            })
        }

    localStorage.setItem('MusicTableau', JSON.stringify(MusicGlobal))

//----------------------------------------------------------------------------------------------------------------//

    $('#bConnexion').click(function (a) {
        connexion.toggle()
    })
    $('#bInscription').click(function () {
        inscription.toggle()
    })
    $('#bDeconnexion').click(function () {
        disconnect()
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
//------------------------------ Audio ---------------------------//
    $('#play').on('click', function () {
        $('#player').get(0).play();
    });

    $('#pause').on('click', function () {
        $('#player').get(0).pause();
    });

    $('#player').on('timeupdate', function () {
        $('.progress-bar').attr("value", this.currentTime / this.duration);
    });

//---------------------------------------------------------//
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

//-----------------------------------------------------------------------------------------//
    function register(event) {
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
                if (actualUser.pseudo == pseudo || actualUser.mail == mail) {
                    if (actualUser.mdp == password) {
                        isConnected = true
                        sessionStorage.setItem("session", JSON.stringify(actualUser))
                        sessionStorage.setItem('idUser', actualUser.id)
                        break;
                    }
                }
            }
            if (isConnected) {
                alert("Bienvenue sur Spatifie")
                $('#start').hide()
                $('#Connexion').hide()
                $('#walldiv').show()
                $('.main').show()
                $('.sidenav').show()
                $('#footer').show()
                $('#sidebar').show()
            } else {
                alert('Connexion échouer !')
            }
            $('#mailpseudo').val("")
            $('#mdp').val("")
        }
    }

    function displayRegister() {
        $('#Inscription').show()
        $('#Connexion').hide()
    }

    function displayLogin() {
        $('#Connexion').show()
        $('#Inscription').hide()
    }

    function okmdp(mdp) {
        var regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/
        return regex.test(mdp)
    }

    function disconnect() {
        sessionStorage.clear()
        $('#start').show()
        $('#Connexion').show()
        $('#walldiv').hide()
        $('.main').hide()
        $('.sidenav').hide()
        $('#footer').hide()
    }

    function previous() {

    }

    function next() {

    }

    function principal() {
        $('.main').show()
        $('.sidenav').show()
        $('#walldiv').show()
        $('#footer').show()
        $('#start').hide()
    }

    function table() {
        loadDoc()
    }
    const audio = document.getElementById('music')
    const start = document.querySelector('.start')
    const end = document.querySelector('.end')
    const progressBar = document.querySelector('.progress-bar')
    const now = document.querySelector('.now')

    function conversion (value) {
        let minute = Math.floor(value / 60)
        minute = minute.toString().length === 1 ? ('0' + minute) : minute
        let second = Math.round(value % 60)
        second = second.toString().length === 1 ? ('0' + second) : second
        return `${minute}:${second}`
    }

    audio.onloadedmetadata = function () {
        end.innerHTML = conversion(audio.duration)
        start.innerHTML = conversion(audio.currentTime)
    }

    progressBar.addEventListener('click', function (event) {
        let coordStart = this.getBoundingClientRect().left
        let coordEnd = event.pageX
        let p = (coordEnd - coordStart) / this.offsetWidth
        now.style.width = p.toFixed(3) * 100 + '%'

        audio.currentTime = p * audio.duration
        audio.play(go())
        function go (){
            $('#music').attr("src",$(this).attr("src"))
        }
    })

    setInterval(() => {
        start.innerHTML = conversion(audio.currentTime)
        now.style.width = audio.currentTime / audio.duration.toFixed(3) * 100 + '%'
    }, 1000)
})