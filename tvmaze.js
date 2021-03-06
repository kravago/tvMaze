/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  
  const r = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  
  const shows = [];
  for (let item of r.data) {

    // handle missing images
    let showImage = "images/default.png";
    if ('image' in item.show) {
      showImage = item.show.image.medium;
    }

    shows.push({
      'id': item.show.id,
      'name': item.show.name,
      'summary': item.show.summary,
      'image': showImage
    });  
  }

  return shows;

}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
            <button class="btn btn-primary" type="submit">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const r = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  // construct the array of episodes
  const episodes = [];
  for (let item of r.data) {
    episodes.push({
      'id': item.id,
      'name': item.name,
      'season': item.season,
      'number': item.number
    });
                  
    return episodes;
  }
}


// TODO: write a function 
async function populateEpisodes(episodes) {
  // clear any episodes from other shows first
  $('li').remove();

  for (let episode of episodes) {
    const newLi = document.createElement('li');
    newLi.innerText = `${episode.name} - Season: ${episode.season}, Episode: ${episode.number}`
    $('#episodes-list').append(newLi)
  }

  $('#episodes-area').show();
}


// manual testing
// [
//   {
//     'id': 1,
//     'name': 'who was in paris',
//     'season': 2,
//     'number': 1
//   },
//   {
//     'id': 2,
//     'name': 'kanye goes crazy',
//     'season': 2,
//     'number': 2
//   } 
// ]