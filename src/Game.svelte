<script>
  import { createEventDispatcher } from "svelte";
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
    dispatch("goBack");
  }

  // need to make a defautl array so that the doors can appear
  let doors = Array.from({ length: 3 }).map((e, i) => i);

  function formatedResults(results) {
    if (!results) return;
    let fResults = results.reduce(
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
      text: "Pick a door",
    },
    {
      text: "A door with no win is revealed",
    },
    {
      text: `Switch to door ${
        [0, 1, 2].filter((e) => e !== revealDoor && e !== pickDoor)[0]
      }?`,
    },
    {
      text: "",
    },
  ];

  // play the entire game within a function
  function newGame() {
    /////////////
    // the setup
    /////////////

    // played did not yet decide to switch or not
    decidedIfSwitch = false;

    // make a new doors array
    doors = Array.from({ length: 3 }).map((e, i) => i);

    // gamestep
    gameStep = 0;

    // new winning door
    winDoor = Math.floor(Math.random() * 3);

    // get the doors
    doorsHTML = [...doorContainer.children];

    // uncolor all the doors
    doorsHTML.forEach((e) => {
      e.style.background = "none";
      e.style.border = "1px solid black";
      e.style.outline = "none";
      e.innerHTML = "???";
    });
  }

  function handleStep(e, d) {
    // Initial Guess
    if (gameStep == 0) {
      // save the pick
      pickDoor = d;

      // color the door
      doorsHTML[d].style.background = "red";
      doorsHTML[d].innerHTML = "Picked";

      // increase the step
      gameStep = 1;
    }

    // switching or not
    if (gameStep === 2) {
      if (d === "yes") {
        pickDoor = doors.find((e) => {
          return e !== pickDoor && e !== revealDoor;
        });
        switched = true;
      } else {
        switched = false;
        pickDoor = pickDoor;
      }

      gameStep = 3;
      decidedIfSwitch = true;
      evalGame(pickDoor, winDoor);
    }
  }

  // if the user just made the initial guess
  $: if (gameStep === 1) {
    // reveal the door
    console.log(
      `The winning door is door: ${winDoor}.\n The pick is door: ${pickDoor}`
    );

    // check the options you have to reveal
    let options = doors.filter((d, i) => {
      return d !== winDoor && d !== pickDoor;
    });

    // reveal one door from the options
    revealDoor = options[Math.floor(Math.random() * options.length)];

    // color the revealed loose
    doorsHTML[revealDoor].style.outline = "3px solid green";
    doorsHTML[revealDoor].innerHTML = "No Win Here";

    // bump up the gamestep to 2
    gameStep = 2;
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
</script>

<section class="container" style="min-height: 50vh;">
  <div class="instructions-container h-8">
    <p class="instruction">{gameInstructions[gameStep].text}</p>
  </div>

  <div
    class="door-container flex justify-center text-center"
    bind:this={doorContainer}
  >
    {#each doors as d, i}
      <div
        class="door {i !== revealDoor && i !== pickDoor
          ? 'switch-possible'
          : ''} flex flex-col justify-center"
        on:click={function (e) {
          handleStep(e, d);
        }}
      >
        <!-- {i === pickDoor ? "picked Door" : i === revealDoor ? "No Win" : "???"} -->
        ???
      </div>
    {/each}
  </div>

  {#if doorsHTML}
    <div class="results-switch h-8">
      {#if gameStep === 2 && !decidedIfSwitch}
        <div class="switch-container">
          {#each swtichOptions as o, i}
            <button class="option" on:click={(e) => handleStep(e, o)}>
              {o}
            </button>
          {/each}
        </div>
      {/if}

      <!-- the results -->
      {#if decidedIfSwitch}
        <div class="text-center">
          You: {results[game - 1].win ? "Won!!!" : "Lost :("}
        </div>
      {/if}
    </div>

    <div class="new-game">
      <!-- start a new game only after the children for the current game are loaded -->
      <button on:click={reset}>New Game</button>
      <button on:click={goBack} class="goBackToInstructions">GoBack</button>
    </div>
  {/if}
</section>

<style>
  .door-container {
    display: flex;
    gap: 1rem;
    width: 80vw;
    height: 45vh;
  }

  .door {
    border: 1px solid black;
    width: 25vw;
    height: 40vh;
    box-shadow: 2px 2px 2px 2px;
  }

  @media screen and (min-width: 450px) {
    .door {
      height: 40vh;
    }
  }

  .new-game {
    display: flex;
    justify-content: center;
  }

  .switch-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
</style>
