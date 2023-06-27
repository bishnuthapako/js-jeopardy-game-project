// categories is the main data structure for the app; it looks like this:

const $start = $("#start");
const $jeopardy = $("#jeopardy");
const $tbody = $("tbody");

let currentClueIdx = 0;
let currentCategoryIdx = 0;

let categories = [];
const NUM_CATEGORIES = 6;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
   const res = await axios.get("https://jservice.io/api/categories?count=100");
  shuffleTheArray(res.data);
  return res.data.map(c => c.id).splice(1,NUM_CATEGORIES);
}

function shuffleTheArray(arr) {
    arr.forEach((val, key) => {
        randomIndex = Math.ceil(Math.random()*(key + 1));
        arr[key] = arr[randomIndex];
        arr[randomIndex] = val;
      });
}

// const NUM_CATEGORIES = 10;
// const categoryId = [];

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const cat = await axios.get(`https://jservice.io/api/category?id=${catId}`);
    shuffleTheArray(cat.data.clues);
    const clues = cat.data.clues.splice(0, 2).map(clue=>({
        question: clue.question,
        answer: clue.answer,
        showing: null
    }));
    return {
        title: cat.data.title,
        clues: clues
    }
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable(cat, cl) {
    const section = $("#jeopardy");
    $('.cat-container').remove();
    const catDiv = $(`<div class="cat-container"></div>`);
    const title = $(`<h2 class="title">${cat.title}</h2>`);
    const quest = $(`<p class="question content">Q: ${cl.question}?</p>`);
    const ans = $(`<p class="answer content">A: ${cl.answer}</p>`);
  
    cl.showing = "question"; // Default: question is shown first
    ans.hide();
  
    catDiv.append(title);
    catDiv.append(quest);
    catDiv.append(ans);
  
    catDiv.on("click", handleClick);
  
    section.append(catDiv); 
  }
  

/** Handle clicking on a clue: show the question or answer.
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    // Ren: I went for simple for loop. Because returning/breaking forEach is impossible
    // Ren: Each time we click, we loop through the array and look for `showing`
    // If question, we show answer
    // If null, we render new question
    // If answer, we just ignore
    // Each loop we check if we reached last question or not and display Gameover!
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      console.log(cat, 'cat-i')
      let exit = false;
      for (let j = 0; j < cat.clues.length; j++) {
        const cl = cat.clues[j];

        // console.log(cl.showing, 'showing')
  
        if (cl.showing == "question") {
          $('.answer').show();
        //   $('.question').hide();
          cl.showing = "answer";
          return;
        }
  
        if (cl.showing == null) {
          fillTable(cat, cl);
          exit = true;
          return;
        }
  
        if (i === categories.length - 1 && j === cat.clues.length - 1) {
          alert("Gameover!");
          $("#heading").show()
          $start.show().text("Restart");
          $('.cat-container').remove();
          $jeopardy.hide();
          location.reload()
        }
      }
  
      if (exit) return;
    }
  }

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $("#loading").show();
    $start.prop('disabled', true)
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
$("#loading").hide();
$start.prop('disabled', false)
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const categoryIds = await getCategoryIds();
    for (let i = 0; i < categoryIds.length; i++) {
        const cat = await getCategory(categoryIds[i]);
        categories.push(cat);
    }

    fillTable(categories[0], categories[0].clues[0]); // Display only the first one on start
}

/** On click of start / restart button, set up game. */

$start.on("click", async function(){
    showLoadingView();
    $start.hide();
   $("#heading").hide()
    await setupAndStart()
    hideLoadingView()
    $jeopardy.show()
    // $("#answer").hide();
    // $jeopardy.on("click",handleClick)
   })



// TODO

/** On page load, add event handler for clicking clues */

// TODO



