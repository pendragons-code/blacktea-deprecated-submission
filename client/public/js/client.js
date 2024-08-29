document.addEventListener("DOMContentLoaded", () => {
	const createRoomBtn = document.getElementById("createRoomBtn");
	const startBtn = document.getElementById("startGame");
	const endBtn = document.getElementById("endGame");
	const pacman = document.getElementById("pacman");
	const home = document.getElementById("home");
	const joinRoomBtn = document.getElementById("joinRoomBtn");
	const scoreBoard = document.getElementById("scoreboard");
	const wordInput = document.getElementById("word-input");
	const submitWordBtn = document.getElementById("submit-word-btn");
	const roomCreatorDiv = document.getElementById("roomCreator");
	const roomExpiryDiv = document.getElementById("roomExpiry");
	const messageDiv = document.getElementById("message");
	const lastWordDiv = document.getElementById("lastWord");
	const roomIDDiv = document.getElementById("roomIDValue"); //roomID = roomIDDivValue and then also after the button is created roomID.textContent = roomID from create event


	//document.getElementById("roomID").textContent;

	wordInput.disabled = true;
	submitWordBtn.disabled = true;
	endBtn.disabled = true;
	startBtn.disabled = true;
	const socket = io();

	function newMessage(input) {
		messageDiv.textContent = `[Server Message]: ${input}`;
	}

	function updateScoreboard(input) {
		scoreBoard.innerHTML = input;
	}

	// roomID will be read from the join textInput

	// socket emit events
	socket.on("timesup", (details) => {
		wordInput.disabled = true;
		submitWordBtn.disabled = true;
		newMessage(`Player ${details.playerNumber} took too long!`);
	});

	socket.on("disconnect", () => {
		alert("Lost connection to server!");
		return window.location.href = "/";
	});

	socket.on("RoomDoesNotExist", () => {
		alert("This room does not exist!");
		return window.location.href = "/";
	});

	socket.on("roomExpired", () => {
		return alert("This room has expired!");
	});

	socket.on("notEnoughPlayersToStart", () => {
		startBtn.disabled = false;
		return alert("This room does not have enough players to start.");
	});

	socket.on("alert", (message) => {
		return alert(message);
	});

	socket.on("redirect", (message) => {
		alert(message);
		setTimeout(function() {
			window.location.href = "/";
		}, 2000);
	});

	socket.on("message", (message) => {
		return newMessage(message);
	});

	socket.on("roomID", (roomIDfromSocket) => {
		document.getElementById("roomID").textContent = `${roomIDfromSocket}`;
	});

	// broadcast events
	socket.on("newPlayerJoined", (details) => {
		newMessage(`Player ${details.playerNumber} joined!`);
	});

	socket.on("playerCountLow", () => {
		alert("Too little players!");
		setTimeout(function() {
			window.location.href = "/";
		}, 2000);
	});

	socket.on("nextTurn", (details) => {
		document.getElementById("turn").textContent = `Player ${details.playerNumber}'s turn!`;
	})

	socket.on("yourTurn", (details) => {
		newMessage(`Your turn, player ${details.playerNumber}`);
		submitWordBtn.disabled = false;
		wordInput.disabled = false;
		let countDown = 10;
		setInterval(function() {
			if(countDown < 0) return
			newMessage(`You have ${countDown} seconds to provide a word!`);
			countDown -= 1;
		}, 1000);
	})

	socket.on("newWord", (details) => {
		document.getElementById("lastWord").textContent = `previous word: ${details.lastWord}`;
		document.getElementById("words-used").innerHTML = `used words:<br>${details.wordList.join(", ")}`;
	})

	socket.on("gameStart", (details) => {
		newMessage(`Game has started!`);
		wordInput.disabled = true;
		roomCreatorDiv.textContent = `creator: Player ${details.playerNumber}`; // the first turn is the creator ID
		roomExpiryDiv.textContent = `room expiry: ${details.gameExpiry}`;
	});

	socket.on("endGame", (details) => {
		newMessage("Game End!").then(() => {
			let countDown = 5;
			setTimeout(window.location.href = "/", 5000);
			setInterval(function() {
				newMessage(`Game Ended! Redirecting in ${countDown}`);
				countDown -= 1;
			}, 1000);
		});
	});

	socket.on("addedPoint", (details) => {
		newMessage(`1 point added to Player ${details.playerNumber}`);
		updateScoreboard(`Score:<br>${JSON.stringify(details.score).replaceAll('"', "").replaceAll("{", "").replaceAll("}", "")}`);
	});

	socket.on("wordDoesNotBeginWithLastLetter", (details) => {
		newMessage(`Player ${details.playerNumber} provided a word that does not begin with the last letter.`);
	});

	socket.on("thisWordWasUsedBefore", (details) => {
		newMessage(`Player ${details.playerNumber} provided a word that was used before.`);
	});

	socket.on("invalidCharacters", (details) => {
		newMessage(`Player ${details.playerNumber} provided a word that has invalid characters.`);
	});

	socket.on("notInEnableDictionary", (details) => {
		newMessage(`Player ${details.playerNumber} provided a word that does appear in the enable dictionary.`);
	});


	// button events
	submitWordBtn.addEventListener("click", () => {
		word = wordInput.value
		if(word !== "") {
			socket.emit("submitWord", word, document.getElementById("roomID").textContent);
			wordInput.value = "";
			submitWordBtn.disabled = true;
			newMessage("");
			wordInput.disabled = true;
		}
		wordInput.disabled = true;
	});

	startBtn.addEventListener("click", () => {
		socket.emit("startGame", document.getElementById("roomID").textContent);
		endBtn.disabled = false;
		wordInput.disabled = true;
		return startBtn.disabled = true;
	});

	endBtn.addEventListener("click", () => {
		socket.emit("endGame", document.getElementById("roomID").textContent);
		wordInput.disabled = true;
		return endBtn.disabled = true;
	});

	createRoomBtn.addEventListener("click", () => { // duplicates, i will removes all the extra stuff one day!
		createRoomBtn.disabled = true;
		joinRoomBtn.disabled = true;
		startBtn.disabled = false;
		joinRoomBtn.remove();
		roomIDDiv.remove();
		pacman.remove();
		home.remove();
		createRoomBtn.remove();
		return socket.emit("createRoom");
	});

	joinRoomBtn.addEventListener("click", () => {
		if(roomIDDiv.value !== "") { // duplicates, i will removes all the extra stuff one day!
			joinRoomBtn.disabled = true;
			document.getElementById("roomID").textContent = roomIDDiv.value.trim();
			joinRoomBtn.remove();
			roomIDDiv.remove();
			startBtn.remove();
			endBtn.remove();
			pacman.remove();
			home.remove();
			createRoomBtn.remove();
			return socket.emit("joinRoom", roomIDDiv.value.trim());
		}
	});

});