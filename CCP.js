var beachmusivs;
$(window).ready(function () {
    localStorage.getItem('Utilisateurs')
    $('#start').show()
    var connexion = $("#Connexion")
    var inscription = $('#Inscription')
    function principal() {
        $('.main').show()
        $('.sidenav').show()
        $('#walldiv').show()
        $('#footer').show()
        $('#start').hide()
    }
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

            // ------------------------------------ TEST ----------------------------------- //
            // Select all the elements in the HTML page
            // and assign them to a variable
            let playpause_btn = document.querySelector(".playpause-track");
            let next_btn = document.querySelector(".next-track");
            let prev_btn = document.querySelector(".prev-track");

            let seek_slider = document.querySelector(".seek_slider");
            let volume_slider = document.querySelector(".volume_slider");
            let curr_time = document.querySelector(".current-time");
            let total_duration = document.querySelector(".total-duration");
            // Specify globally used values
            let track_index = 0;
            let isPlaying = false;
            let updateTimer;
            //Création de l'audio
            let curr_track = document.createElement('audio');

            function loadTrack(track_index) {
                // Clear the previous seek timer
                clearInterval(updateTimer);
                resetValues();

                // Load a new track
                curr_track.src = beachmusivs[track_index];
                curr_track.load();
                console.log(curr_track)

                // Set an interval of 1000 milliseconds
                // for updating the seek slider
                updateTimer = setInterval(seekUpdate, 1000);
                // Move to the next track if the current finishes playing
                // using the 'ended' event
                curr_track.addEventListener("ended", nextTrack);
            }

            function resetValues() {
                curr_time.textContent = "00:00";
                total_duration.textContent = "00:00";
                seek_slider.value = 0;
            }

            function playpauseTrack() {
                // Switch between playing and pausing
                // depending on the current state
                if (!isPlaying) playTrack();
                else pauseTrack();
            }

            function playTrack() {
                // Play the loaded track
                curr_track.play();
                isPlaying = true;

                // Replace icon with the pause icon
                playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
            }

            function pauseTrack() {
                // Pause the loaded track
                curr_track.pause();
                isPlaying = false;
            }

            function nextTrack() {
                // Go back to the first track if the
                // current one is the last in the track list
                if (track_index < beachmusivs.length - 1)
                    track_index += 1;
                else track_index = 0;

                // Load and play the new track
                loadTrack(track_index);
                playTrack();
            }

            function prevTrack() {
                // Go back to the last track if the
                // current one is the first in the track list
                if (track_index > 0)
                    track_index -= 1;
                else track_index = beachmusivs.length;

                // Load and play the new track
                loadTrack(track_index);
                playTrack();
            }

            function seekTo() {
                // Calculate the seek position by the
                // percentage of the seek slider
                // and get the relative duration to the track
                seekto = curr_track.duration * (seek_slider.value / 100);

                // Set the current track position to the calculated seek position
                curr_track.currentTime = seekto;
            }

            function setVolume() {
                // Set the volume according to the
                // percentage of the volume slider set
                curr_track.volume = volume_slider.value / 100;
            }

            function seekUpdate() {
                let seekPosition = 0;

                // Check if the current track duration is a legible number
                if (!isNaN(curr_track.duration)) {
                    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
                    seek_slider.value = seekPosition;

                    // Calculate the time left and the total duration
                    let currentMinutes = Math.floor(curr_track.currentTime / 60);
                    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
                    let durationMinutes = Math.floor(curr_track.duration / 60);
                    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

                    // Add a zero to the single digit time values
                    if (currentSeconds < 10) {
                        currentSeconds = "0" + currentSeconds;
                    }
                    if (durationSeconds < 10) {
                        durationSeconds = "0" + durationSeconds;
                    }
                    if (currentMinutes < 10) {
                        currentMinutes = "0" + currentMinutes;
                    }
                    if (durationMinutes < 10) {
                        durationMinutes = "0" + durationMinutes;
                    }

                    // Display the updated duration
                    curr_time.textContent = currentMinutes + ":" + currentSeconds;
                    total_duration.textContent = durationMinutes + ":" + durationSeconds;
                }
            }

            $('.prev-track').on('click', prevTrack)
            $('.playpause-track').on('click', playpauseTrack)
            $('.next-track').on('click', nextTrack)
            $('.seek_slider').on('change', seekTo)
            $('.volume_slider').on('change', setVolume)
            // Load the first track in the tracklist
            loadTrack(track_index);
            $(".listen").click(function (event) {
                event.preventDefault()
                curr_track.attr("src", $(this).attr("src"))
            })
        })

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
        function table() {
            loadDoc()
        }
    }
})