const neatCsv = require('neat-csv');
const fs = require('fs')

fs.readFile('./matches.csv', async (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  /* Getting csv data */
  let csv_data = await neatCsv(data);
  //console.log(csv_data);

  let year = csv_data.map(({id, season}) => ({id, season}));
  //1. Number of matches played per year of all the years in IPL
  console.log('\r\n',"1. Number of matches played per year of all the years in IPL",'\r\n');
  let lookup = {};
  let items = csv_data;
  let result = [];
  let played_matches_per_year = 0;
  let remaining_year = '';
  for (let item, i = 0; item = items[i++];) {
    let season = item.season;
    if(i == 1){
      remaining_year = season;
    }
    if (!(season in lookup)) {
      if(played_matches_per_year != 0){
        console.log("No. of Matches Played in ",season," are ",played_matches_per_year);
        played_matches_per_year = 0;
      }
      lookup[season] = 1;
      result.push(season);
    } else {
      played_matches_per_year++;
    }
  }
  console.log("No. of Matches Played in ",remaining_year," are ",played_matches_per_year,'\r\n');

   console.log("2. Number of matches won of all teams over all the years of IPL.",'\r\n');
   let lookup_winner = {};
   let items_winner = csv_data;
   let result_winner = [];
   let won_matches_by_team = 0;
   for (let item_winner, i = 0; item_winner = items_winner[i++];) {
    let winner = item_winner.winner;
  
    if (!(winner in lookup_winner)) {
      console.log("No. of won by ",winner," - ",winner.length);
      lookup_winner[winner] = 1;
      result.push(winner);
    } else {
      won_matches_by_team++;
    }

  }

console.log('\r\n',"3. For the year 2016 get the extra runs conceded per team.",'\r\n');
  let lookup_runs = {};
  let items_runs = csv_data;
  let total_run = 0;
  for (let item_runs, i = 0; item_runs = items_runs[i++];) {

    let season_winner = item_runs.season;
    let season_winner_runs = item_runs.win_by_runs;
    let extra_run_winner = item_runs.winner;
    if(season_winner == 2016){
      if (!(extra_run_winner in lookup_runs)) {
        //console.log("No. of won by ",season_winner_runs,extra_run_winner);
        lookup_runs[extra_run_winner] = season_winner_runs;
        result.push(extra_run_winner);
      } else{
        lookup_runs[extra_run_winner] = Number(lookup_runs[extra_run_winner]) + Number(season_winner_runs);
      }
      //console.log(Object.values(items_runs));
    }

  }
  console.log(lookup_runs);

  /*********************************************************************************** */



  fs.readFile('./deliveries.csv', async (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    /* Getting deliveries csv data */
    let bowling_data = await neatCsv(data);
    
    console.log('\r\n',"4. For the year 2015 get the top economical bowlers.",'\r\n');
    let lookup_economy = {};
    let count_ball = {};
    let items_economy = bowling_data;

    /* Taking year */
    year_id = {};
    year.forEach(element => {
      if(element.season == 2015){
        year_id[element.id] = 1;
      }
    });

    for (let item_economy, i = 0; item_economy = items_economy[i++];) {
    
      let bowler = item_economy.bowler;
      let total_runs_bow = item_economy.total_runs;
      let bowling_data_id = item_economy.match_id;
      if(bowling_data_id in year_id){
        if (!(bowler in lookup_economy)) {
          lookup_economy[bowler] = total_runs_bow;
          count_ball[bowler] = 1;
          result.push(bowler);
        } else {
          lookup_economy[bowler] = Number(lookup_economy[bowler]) + Number(total_runs_bow);
          count_ball[bowler] = Number(count_ball[bowler]) + 1;
        }
      }
      
    }

    let bowers_final_economy = {};
    for(var i in count_ball)
    {
      bowers_final_economy[i] = (lookup_economy[i]/(Number(count_ball[i]) / 6));
     //console.log(i,":", (lookup_economy[i]/(Number(count_ball[i]) / 6)));
    }
    //console.log(bowers_final_economy);
    let array_sorted=[];
    for(a in bowers_final_economy){
      array_sorted.push([a,bowers_final_economy[a]]);
    }
    array_sorted.sort(function(a,b){return a[1] - b[1]}).slice(0, 10);
    console.log(array_sorted.slice(0,10));

  });


});

