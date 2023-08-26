        // Obtener el canvas y el contexto de dibujo
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");

        // Definir las propiedades del jugador
        var playerX = canvas.width / 2;
        var playerY = canvas.height - 30;
        var playerWidth = 10;
        var playerHeight = 10;
        var playerSpeed = 5;
        var playerLives = 3;
        var playerBullets = 50;
        var reloadTime = 2000; // Tiempo en milisegundos para recargar las balas
        var canShoot = true;

        // Definir las propiedades de los disparos del jugador
        var shoots = [];

        // Score del jugador
        var score = 0;
        var bestScore = getCookie("bestScore") || 0;

        // Variable para guardar el ID del intervalo de recarga de balas
        var reloadInterval;

        // Variables para rastrear la dirección del movimiento del jugador
        var playerDirectionX = 0;
        var playerDirectionY = 0;

        // Variable para almacenar la última dirección del jugador
        var lastPlayerDirectionX = 0;
        var lastPlayerDirectionY = 1; // Invertir dirección hacia abajo

        // Función para inicializar el juego
        function initializeGame() {
            // Reiniciar el jugador
            playerX = canvas.width / 2;
            playerY = canvas.height - 30;
            playerLives = 3;
            playerBullets = 50;
            score = 0;
            clearInterval(reloadInterval);
            canShoot = true;

            // Intervalo de tiempo para recargar las balas (2 segundos)
            reloadInterval = setInterval(function() {
                if (playerBullets < 50) {
                    playerBullets++;
                }
            }, reloadTime);
        }

        // Función para dibujar al jugador
        function drawPlayer() {
            ctx.fillStyle = "blue";
            ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
        }

        // Función para dibujar los disparos
        function drawShoots() {
            ctx.fillStyle = "green";
            for (var i = 0; i < shoots.length; i++) {
                var shoot = shoots[i];

                // Utilizar el método arc para dibujar un círculo
                ctx.beginPath();
                ctx.arc(shoot.x, shoot.y, shoot.radius, 0, 2 * Math.PI);
                ctx.fill();

                shoot.y -= shoot.speed * shoot.directionY;
                shoot.x += shoot.speed * shoot.directionX;

                // Verificar si el disparo ha salido del canvas
                if (shoot.y < 0 || shoot.x < 0 || shoot.x > canvas.width) {
                    // Si salió del canvas, eliminar el disparo de la lista
                    shoots.splice(i, 1);
                    i--;
                }
            }
        }

        // Función para verificar colisiones entre el jugador y los enemigos
        function checkCollisions() {
            // ... (resto del código de colisiones con enemigos y jefe)

            // Verificar si el jugador perdió todas las vidas
            if (playerLives <= 0) {
                // Actualizar el Best Score si es necesario
                if (score > bestScore) {
                    bestScore = score;
                    setCookie("bestScore", bestScore, 365);
                }
                // Reiniciar el juego
                initializeGame();
                return true;
            }

            return false;
        }

        // Función para generar un disparo desde el jugador
        function generateShoot() {
            if (playerBullets > 0) {
                var shootRadius = 5; // Radio del círculo (puedes ajustarlo según tu preferencia)
                var shootX = playerX + playerWidth / 2;
                var shootY = playerY;
                var shootSpeed = 8;

                // Aplicar la dirección del jugador al disparo
                var shootDirectionX = lastPlayerDirectionX;
                var shootDirectionY = lastPlayerDirectionY;

                shoots.push({ x: shootX, y: shootY, radius: shootRadius, speed: shootSpeed, directionX: shootDirectionX, directionY: shootDirectionY });
                playerBullets--;
            }
        }

        // Función para mover al jugador y actualizar las variables de dirección
        function movePlayer() {
            playerDirectionX = 0;
            playerDirectionY = 0;

            if (keys.ArrowLeft && playerX > 0) {
                playerX -= playerSpeed;
                playerDirectionX = -1; // Mover hacia la izquierda
            }
            if (keys.ArrowRight && playerX < canvas.width - playerWidth) {
                playerX += playerSpeed;
                playerDirectionX = 1; // Mover hacia la derecha
            }
            if (keys.ArrowUp && playerY > 0) {
                playerY -= playerSpeed;
                playerDirectionY = 1; // Mover hacia arriba (se invirtió la dirección)
            }
            if (keys.ArrowDown && playerY < canvas.height - playerHeight) {
                playerY += playerSpeed;
                playerDirectionY = -1; // Mover hacia abajo (se invirtió la dirección)
            }

            // Actualizar la última dirección del jugador
            if (playerDirectionX !== 0 || playerDirectionY !== 0) {
                lastPlayerDirectionX = playerDirectionX;
                lastPlayerDirectionY = playerDirectionY;
            }
        }

        // Función para dibujar el juego
        function draw() {
            // Limpiar el canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dibujar al jugador
            drawPlayer();

            // Dibujar los disparos
            drawShoots();

            // Mover al jugador
            movePlayer();

            // Verificar colisiones
            if (checkCollisions()) {
                return;
            }

            // Dibujar el score y el Best Score
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText("Score: " + score, 10, 20);
            ctx.fillText("Best Score: " + bestScore, 10, 40);
            ctx.fillText("Lives: " + playerLives, 10, 60);
            ctx.fillText("Bullets: " + playerBullets, 10, 80);

            // Solicitar el próximo frame
            requestAnimationFrame(draw);
        }

        // Definir la función de manejo de teclado
        var keys = {};
        document.addEventListener("keydown", function (e) {
            keys[e.code] = true;
            if (e.code === "Space" && canShoot) {
                generateShoot();
                canShoot = false;
                setTimeout(function() {
                    canShoot = true;
                }, 200); // Tiempo de espera entre disparos (200ms)
            }
        });
        document.addEventListener("keyup", function (e) {
            keys[e.code] = false;
        });

        // Función para establecer una cookie
        function setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        // Función para obtener el valor de una cookie
        function getCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        // Iniciar el juego
        initializeGame();
        draw();
    
