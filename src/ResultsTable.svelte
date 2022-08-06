<script>
  export let results;
  console.log(`results: `, results);
</script>

<div class="results">
  <div class="header">Move</div>
  <div class="header">Played</div>
  <div class="header">Won</div>
  <div class="header">Rate</div>
  <div>Switched</div>
  <div>{results.switched.played}</div>
  <div>{results.switched.won}</div>
  <div>
    {(results.switched.won / results.switched.played).toLocaleString("DE", {
      maximumFractionDigits: 2,
    })}
  </div>
  <div>Put</div>
  <div>{results.put.played}</div>
  <div>{results.put.won}</div>
  <div>
    {(results.put.won / results.put.played || "-").toLocaleString("DE", {
      maximumFractionDigits: 2,
    })}
  </div>
</div>

<style>
  .results {
    padding-top: 2rem;
    display: grid;
    grid-template-rows: repeat(3, minmax(0, 1fr));
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .results > * {
    border: 1px solid burlywood;
    padding: 0.5rem;
    text-align: center;
  }

  .results > .header {
    font-weight: bold;
  }

  @media screen and (min-width: 450px) {
    .results {
      max-width: 60vw;
      margin: 0 auto;
    }
  }
</style>
