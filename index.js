document.addEventListener("DOMContentLoaded", function () {
	const totalBoxInGrid = 36;
	const baseMoney = 360;
	const defaultText = "Choose a box to dig!";
	const gameTextList = [
		"Are u sure?",
		"noooooo!!",
		"Maybe another?",
		"??????",
		"A little here",
		"What's in there?",
	];
	let pageState = 0;
	let totalBigMoney;
	let boxStates, boxMoneys;
	let lastClickedIndex;
	let digTimes;
	let summationReward;
	let gameTextState;

	function initializeGameProperty() {
		totalBigMoney = 4;
		lastClickedIndex = -1;
		digTimes = 24;
		summationReward = 0;
		gameTextState = 0;
	}

	function pageChanger() {
		const mainBox = document.querySelector("main");
		mainBox.innerHTML = "";
		if (pageState === 0) {
			mainBox.appendChild(startPage());
			initializeGameProperty();
		}
		if (pageState === 1) {
			mainBox.appendChild(gameDrivenPage());
		}
		if (pageState === 2) {
			mainBox.appendChild(summaryPage());
		}
	}

	function textChanger(textState, textContent) {
		const gameTextTag = document.querySelector("h1");
		if (textState < 0) {
			textState = 0;
		}
		if (textState > 2) {
			textState = 2;
		}
		gameTextState = textState;
		if (textState === 0) {
			gameTextTag.textContent = defaultText;
		}
		if (textState === 1) {
			gameTextTag.textContent = `${digTimes} times left!!`;
		}
		if (textState === 2) {
			gameTextTag.textContent = textContent;
		}
	}

	function transitioningPage() {
		const outerBox = document.querySelector(".outer-box");
		outerBox.classList.add("page-transition-effect");
		void outerBox.offsetWidth;
		outerBox.addEventListener("transitionend", function () {
			outerBox.classList.remove("page-transition-effect");
			pageState++;
			pageState = pageState % 3;
			pageChanger();
		});
	}

	function nextPage() {
		transitioningPage();
	}

	function createOuterBox() {
		const outerBox = document.createElement("div");
		outerBox.classList.add("outer-box");
		return outerBox;
	}

	function startPage() {
		const startBox = createOuterBox();
		const gameNameTag = document.createElement("h1");
		gameNameTag.textContent = "Treasure hunting";
		const startButton = document.createElement("button");
		startButton.textContent = "Start!";
		startButton.classList.add("button");
		startButton.id = "start-button";
		startButton.addEventListener("click", nextPage);
		startBox.appendChild(gameNameTag);
		startBox.appendChild(startButton);
		return startBox;
	}

	function resetSubBox(index) {
		if (boxStates[index] != 2) {
			const lastBox = document.querySelector(
				`#sub-box-${lastClickedIndex}`
			);
			lastBox.style.backgroundColor = "";
			boxStates[lastClickedIndex] = 0;
		}
	}

	function boxAction(boxId) {
		const targetBox = document.querySelector(`#${boxId}`);
		boxIndex = parseInt(boxId.split("-")[2]);
		if (boxIndex != lastClickedIndex && lastClickedIndex != -1) {
			textChanger(gameTextState - 1);
			resetSubBox(lastClickedIndex);
		}
		if (boxStates[boxIndex] === 0) {
			textChanger(
				2,
				gameTextList[
					Math.floor(Math.random() * 40) % gameTextList.length
				]
			);
			targetBox.style.backgroundColor = "#484f5c";
			lastClickedIndex = boxIndex;
		}
		if (boxStates[boxIndex] === 1) {
			if (boxMoneys[boxIndex] <= 0) {
				targetBox.textContent = 0;
				textChanger(2, "Nothing here, haha");
			} else {
				targetBox.textContent = boxMoneys[boxIndex];
				textChanger(2, `You have got ${boxMoneys[boxIndex]}$`);
			}
			summationReward += boxMoneys[boxIndex];
			targetBox.style.backgroundColor = "#717d91";

			digTimes--;
			// showDigTimesText();
			if (digTimes === 0) {
				nextPage();
			}
		}

		if (boxStates[boxIndex] != 2) {
			boxStates[boxIndex]++;
		}
	}

	function gameDrivenPage() {
		boxStates = Array(totalBoxInGrid).fill(0);
		boxMoneys = Array(totalBoxInGrid);
		let remainMoney = baseMoney;
		for (let i = 0; i < totalBoxInGrid; i++) {
			boxMoneys[i] = Math.ceil(Math.random() * 10);
			remainMoney -= boxMoneys[i];
		}
		while (remainMoney > 0 && totalBigMoney > 0) {
			for (let i = 0; i < totalBoxInGrid; i++) {
				boxMoneys[i] -=
					Math.floor(Math.random() * 10) %
					Math.ceil(Math.random() * 2);
			}
			boxMoneys[Math.floor(Math.random() * 100) % totalBoxInGrid] =
				Math.ceil((Math.random() * remainMoney) / totalBigMoney);
			totalBigMoney--;
		}

		const gameDrivenBox = createOuterBox();
		gameDrivenBox.addEventListener("click", (Event) => {
			if (Event.target == gameDrivenBox) {
				textChanger(gameTextState - 1);
				resetSubBox(lastClickedIndex);
			}
		});
		const gameTextTag = document.createElement("h1");
		gameTextTag.textContent = defaultText;
		const gameBox = document.createElement("div");
		gameBox.classList.add("game-box");
		for (let i = 0; i < totalBoxInGrid; i++) {
			let subBox = document.createElement("div");
			subBox.classList.add("sub-box");
			subBox.id = `sub-box-${i.toString()}`;
			subBox.addEventListener("click", function (event) {
				event.preventDefault();
				boxAction(event.target.id);
			});
			gameBox.appendChild(subBox);
		}
		gameDrivenBox.appendChild(gameTextTag);
		gameDrivenBox.appendChild(gameBox);
		return gameDrivenBox;
	}

	function summaryPage() {
		const summaryBox = createOuterBox();
		const summaryTextTag = document.createElement("h1");
		summaryTextTag.textContent = `You got total ${summationReward}$`;
		const resetButton = document.createElement("button");
		resetButton.textContent = "Reset";
		resetButton.classList.add("button");
		resetButton.id = "reset-button";
		resetButton.addEventListener("click", nextPage);
		summaryBox.appendChild(summaryTextTag);
		summaryBox.appendChild(resetButton);
		return summaryBox;
	}

	pageChanger();
});
