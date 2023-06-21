// categories is the main data structure for the app; it looks like this:

const $start = $("#start");
const $jeopardy = $("#jeopardy");
const $tbody = $("tbody");
const $restart = $("#restart");

let currentClueIdx = 0;
let currentCategoryIdx = 0;


//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

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
    // create q&a
    const qaContainer = document.createElement("div");
    qaContainer.classList.add("qa-container");
    const qaContent = `
            <h3 class="display-6 title">${cat.title}</h3>
            <h4 class="text-white mt-4 question">${cl.question}</h4>
            <h4 class="answer" style="display:none">${cl.answer}</h4>
    `;
    qaContainer.innerHTML = qaContent;

    cl.showing = "question"; // Since we are showing this, make it showing=question

    qaContainer.addEventListener("click", handleClick);
    $jeopardy.append(qaContainer)
}

/** Handle clicking on a clue: show the question or answer.
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    categories.forEach(cat => {
        let flag = false;
        cat.clues.forEach(cl => {
            console.log(cl.question);
            if (cl.showing === null) {
                fillTable(cat, cl);
                flag = true;
                return;
            }

            if (cl.showing === "answer") {
                $('.qa-container').remove();
                console.log("removed.....")
                return;
            }

            if (cl.showing === "question") {
                $('.answer').show();
                cl.showing = "answer";
            }
        })
        if (flag) return;
    })
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {

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
    await setupAndStart()
    $jeopardy.show()
    // $("#answer").hide();
    // $jeopardy.on("click",handleClick)
   })



// TODO

/** On page load, add event handler for clicking clues */

// TODO



