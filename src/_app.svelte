<script>
  let step = 0;
  let switched = 0;
  let stayed = 0;
  let gameStep = 3;
  let selectedDoor;
  let gameIdx = 0;

  let intro = [
    { text: "Start" },
    { text: "Imagine there are three Doors" },
    {
      text: "Behind two doors there is a Goat, behind one door there is a prize!",
    },
    {
      text: "Let's Play!",
    },
  ];

  let winIdx = generateWinIdx();

  function generateWinIdx() {
    return Math.floor(Math.random() * 3);
  }

  const restartGame = () => {
    winIdx = generateWinIdx();
    step = gameStep;
  };

  const goNextStep = (e) => {
    if (step === intro.length - 1) return;
    step++;
  };

  const goBackStep = (e) => {
    if (step === 0) return;
    step--;
  };

  const skipIntro = () => {
    step = gameStep;
  };

  let doors = Array.from({ length: 3 })
    .map((e, i) => i)
    .reduce((acc, v, i) => {
      acc[i] = {
        door: v,
        win: i === winIdx ? true : false,
      };
      return acc;
    }, []);

  const selectDoor = (e, d) => {
    selectedDoor = d;
    if (step >= gameStep) {
      let childs = [...doorscontainer.children];
      childs[selectedDoor.door].style.backgroundColor = "#aaa";
    }
  };

  // if a door is selected ask for switch
  let helperMessage;
  $: if (selectedDoor) {
    helperMessage.innerHTML = "Wanna Switch?";
  }

  // example images
  let doorscontainer;
  let doorChildren;
  $: if (step == 2) {
    doorChildren = [...doorscontainer.children];
    doorChildren.forEach((c, i) => {
      if (i === winIdx) {
        c.innerHTML = "<div>WIN</div>";
      } else {
        c.innerHTML = "<div>LOOOSE</div>";
      }
    });
  }

  // the door is selected, reveal a loose
  let showOption = false;
  let revealDoorIdx;
  $: if (selectedDoor && !showOption) {
    let options = doors.filter((d, i) => {
      return d.win === false && d.door !== selectedDoor.door;
    });

    console.log("selected door: ", selectedDoor);
    console.log("options: ", options);

    // select one possible door by chance
    let rand = Math.floor(Math.random() * options.length);
    revealDoorIdx = options[rand].door;

    // reveal the door
    console.log("doors: ", doors);
    let doorsHTML = [...doorscontainer.children];
    doorsHTML[revealDoorIdx].innerHTML = "LOOSE";
    showOption = true;
  }

  // evaluate the game
  let results = [];
  $: console.log("results: ", results);

  let result;
  const evalGame = (e) => {
    showOption = false;
    let choice = e.target.innerHTML;

    if (/[yY]/.test(choice)) {
      // change selection
      let newSelectedDoor = doors.filter((d, i) => {
        return d.door !== selectedDoor.door && d.door !== revealDoorIdx;
      })[0];

      [...doorscontainer.children][newSelectedDoor.door].style.backgroundColor =
        "#aaa";

      [...doorscontainer.children][selectedDoor.door].style.backgroundColor =
        "";

      let won = newSelectedDoor.door === winIdx ? true : false;
      result = { switch: true, won };
    } else {
      // stay put
      let won = selectedDoor.door === winIdx ? true : false;
      result = { switch: false, won };
    }

    restartGame();
  };
</script>

<div class="game-container">
  <h1 class="text-center">This is the Monty Hall Problem</h1>

  <!-- Current text -->
  <div class="explainer-text">
    {intro[step].text}
  </div>

  <!-- buttons -->

  <div class="buttons-container m-4">
    <button on:click={goBackStep}>Back</button>
    <button on:click={skipIntro}>Skip Intro</button>
    <button on:click={goNextStep}>Next</button>
  </div>

  <div class="doors-container" bind:this={doorscontainer}>
    {#if step >= 1}
      {#each doors as d, i}
        <div class="door door-{i}" on:click={(e) => selectDoor(e, d)} />
      {/each}
    {/if}
  </div>

  {#if step >= gameStep}
    <div class="game-instructions">
      <h2 class="helper-message text-center" bind:this={helperMessage}>
        Choose a Door!
      </h2>
    </div>
  {/if}

  <!-- switch yes or no -->
  {#if selectedDoor && showOption}
    <div class="switch-container">
      <button class="button-yes bg-green-300" on:click={evalGame}> YES </button>
      <button class="button-no bg-red-300" on:click={evalGame}> NO </button>
    </div>
  {/if}

  {#if result}
    {@html JSON.stringify(result)}
    <button class="restart" on:click={restartGame}>RESTART</button>
  {/if}
</div>

<style land="scss">
  .game-container {
    width: 70vw;
    margin: 0 auto;
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
  }

  .doors-container {
    display: flex;
    margin: 0 auto;
    justify-content: center;
    gap: 2rem;
  }

  .doors-container > .door {
    height: 200px;
    width: 20%;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .doors-container > .door:hover {
    border: 3px solid black;
  }

  .switch-container {
    display: flex;
    justify-content: space-around;
  }

  .switch-container > button {
    font-size: 3rem;
  }
</style>
