<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  const dispatch = createEventDispatcher();

  // some consts
  let gameStep = 0;
  let winDoor = Math.floor(Math.random() * 3);
  let pickDoor, revealDoor;
  let doorContainer, doorsHTML;
  let game = 0;
  let results = [];
  let switched = false;
  let swtichOptions = ["yes", "no"];
  let decidedIfSwitch = false;

  function goBack() {
    fResults = undefined;
    dispatch("goBack", fResults);
  }

  // need to make a defautl array so that the doors can appear
  let doors = Array.from({ length: 3 }).map((e, i) => i);

  let fResults;
  function formatedResults(results) {
    if (!results) return;
    fResults = results.reduce(
      (acc, curr) => {
        let res = curr["switched"]
          ? {
              ...acc,
              switched: {
                played: acc.switched.played + 1,
                won: acc.switched.won + Number(curr.win),
              },
            }
          : {
              ...acc,
              put: {
                played: acc.put.played + 1,
                won: acc.put.won + Number(curr.win),
              },
            };
        return res;
      },
      {
        switched: {
          played: 0,
          won: 0,
        },
        put: {
          played: 0,
          won: 0,
        },
      }
    );

    dispatch("result", fResults);
    return fResults;
  }

  $: formattedResults = formatedResults(results);

  $: gameInstructions = [
    {
      text: "Pick a door!",
    },
    {
      text: `Switch to door ${
        [0, 1, 2].filter((e) => e !== revealDoor && e !== pickDoor)[0] + 1
      }?`,
    },
    {
      text: "",
    },
  ];

  // play the entire game within a function
  function newGame(simulate = false) {
    if (!simulate) simulating = false;

    // played did not yet decide to switch or not
    decidedIfSwitch = false;

    // make a new doors array
    doors = Array.from({ length: 3 }).map((e, i) => i);

    // gamestep
    gameStep = 0;

    // new winning door
    winDoor = Math.floor(Math.random() * 3);

    if (!simulate) {
      // get the doors
      doorsHTML = [...doorContainer.children];

      // uncolor all the doors
      doorsHTML.forEach((e) => {
        // e.style.background = "none";
        // e.style.border = "1px solid black";
        // e.style.outline = "none";
        e.innerHTML = "???";
        e.removeAttribute("style");
      });
    }
  }

  function handleStep(i, d) {
    // Initial Guess
    if (gameStep == 0) {
      // save the pick
      pickDoor = d;

      // color the door
      doorsHTML[d].style.background = "radial-gradient(#e66465, #9198e5)";
      doorsHTML[d].innerHTML = simulating ? "simulating" : "Picked";

      // get the options to reveal
      let options = doors.filter((d, i) => {
        return d !== winDoor && d !== pickDoor;
      });

      // reveal one door from the options
      revealDoor = options[Math.floor(Math.random() * options.length)];

      // color the revealed loose
      doorsHTML[revealDoor].style.boxShadow = "2px 2px 2px 2px";
      doorsHTML[revealDoor].style.fontSize = simulating ? "4rem" : "10rem";
      doorsHTML[revealDoor].innerHTML = simulating ? "simulating" : "X";

      // // increase the step
      gameStep = 1;
      return;
    }

    // switching or not
    if (gameStep === 1) {
      if (d === "yes") {
        pickDoor = doors.find((e) => {
          return e !== pickDoor && e !== revealDoor;
        });
        switched = true;
      } else {
        switched = false;
        pickDoor = pickDoor;
      }

      doorsHTML.forEach((e, i) => {
        e.style.background =
          i === pickDoor ? "radial-gradient(#e66465, #9198e5)" : "none";
        e.innerHTML = i === winDoor ? "PRIZE" : "LOOSE";
        e.style.fontSize = "4rem";
      });

      gameStep = 2;
      decidedIfSwitch = true;
      evalGame(pickDoor, winDoor);
    }
  }

  $: if (doorContainer) {
    // this will trigger the initial game as it is reactive and doorContainer changes from null to a "html"-nodeList
    newGame();
  }

  function reset() {
    newGame();
  }

  function evalGame(pickDoor, winDoor) {
    let res;
    if (pickDoor === winDoor) {
      res = { win: true, switched };
      results[game] = res;
      results = results;
    } else {
      res = { win: false, switched };
      results[game] = res;
      results = results;
    }
    game++;
  }

  let simulating = false;
  function startSimulation() {
    simulating = true;
    let arr = Array.from({ length: 10000 }).map((e, i) => i);
    for (let i of arr) {
      // select chosen door and winning door
      gameStep = 0;
      pickDoor = Math.floor(Math.random() * 3);
      winDoor = Math.floor(Math.random() * 3);
      handleStep(null, pickDoor);

      // switch in half of the time
      handleStep(null, i % 2 == 0 ? "yes" : "no");
    }
  }
</script>

<section class="game-container" style="min-height: 50vh;">
  <div class="instructions-container-template" style="height: 200px;">
    <!-- {#if !decidedIfSwitch} -->
    <div class="instructions-container text-center">
      {gameInstructions[gameStep].text}
    </div>
    <!-- {/if} -->

    {#if gameStep === 1 && !decidedIfSwitch}
      <div class="switch-container">
        {#each swtichOptions as o, i}
          <button class="option font-xl" on:click={(e) => handleStep(e, o)}>
            {o}
          </button>
        {/each}
      </div>
    {/if}

    <div class="results-switch">
      {#if decidedIfSwitch}
        <div class="text-center" style="font-size: 4rem">
          {#if !simulating}
            You {results[game - 1].win ? "Won!!!" : "Lost :("}
          {:else}
            Simulating...
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <div
    class="door-container flex justify-center text-center"
    bind:this={doorContainer}
    in:slide={{ duration: 1000, delay: 100 }}
    out:fade={{ duration: 50 }}
  >
    {#each doors as d, i}
      <div
        class="door flex flex-col justify-center"
        on:click={function (e) {
          handleStep(e, d);
        }}
      >
        ???
      </div>
    {/each}
  </div>

  {#if doorsHTML}
    <div class="new-game-btns">
      <!-- start a new game only after the children for the current game are loaded -->
      <button on:click={reset}>New Game</button>
      <button on:click={goBack} class="goBackToInstructions"
        >Go back to instructions</button
      >
      <button on:click={startSimulation} class="goBackToInstructions"
        >Simluate 1000 Games</button
      >
    </div>
  {/if}
</section>

<style>
  .instructions-container-template {
    display: flex;
    flex-direction: column;
    min-height: 100px;
    align-items: center;
  }
  .instructions-container {
    font-size: 3rem;
    font-family: "Shadows Into Light", cursive;
    flex-grow: 1;
  }

  .switch-container {
    flex-grow: 1;
  }

  .switch-container > button {
    font-size: 2rem;
    margin-left: 2rem;
    margin-right: 2rem;
  }

  .results-switch {
    font-family: "Shadows Into Light", cursive;
  }

  .door-container {
    display: flex;
    gap: 1rem;
    width: 80vw;
    height: 45vh;
    margin: 0 auto;
  }

  .door {
    border: 1px solid black;
    width: 25vw;
    height: 40vh;
    box-shadow: 2px 2px 2px 2px;
    font-size: 2rem;
  }

  @media screen and (min-width: 450px) {
    .door {
      height: 40vh;
    }
  }

  .new-game-btns {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .new-game-btns > button {
    font-size: 1rem;
    padding: 0.5rem;
  }

  @media screen and (min-width: 450px) {
    .new-game-btns > button {
      font-size: 2rem;
      padding: 0.5rem;
    }
  }
</style>
